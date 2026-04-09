import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { questions } from '@/data/questions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, userName, userEmail } = body;

    if (!userName || !userEmail) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    // 1. Grade the answers
    const validateCode = (questionId: number, userCode: string): boolean => {
      try {
        if (questionId === 9) {
          // Challenge 9: Reverse a String
          // We wrap the user's code and then call their function
          const fn = new Function('str', `${userCode}; return reverseString(str);`);
          return fn("hello") === "olleh" && fn("abc") === "cba";
        }
        if (questionId === 10) {
          // Challenge 10: Find the Largest Number
          const fn = new Function('arr', `${userCode}; return findMax(arr);`);
          return fn([1, 5, 3, 9, 2]) === 9 && fn([-10, -2, -5]) === -2;
        }
        return false;
      } catch (e) {
        console.error(`Error validating code for Q${questionId}:`, e);
        return false;
      }
    };

    let score = 0;
    const gradedResults = questions.map((q) => {
      const userAnswer = answers[q.id];
      let isCorrect = false;

      if (q.type === 'mcq') {
        isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) score += 1;
      } else if (q.type === 'code') {
        if (userAnswer && typeof userAnswer === 'string') {
          isCorrect = validateCode(q.id, userAnswer);
          if (isCorrect) score += 1;
        }
      }

      return { questionId: q.id, isCorrect, userAnswer };
    });

    const totalScore = `${score}/${questions.length}`;

    // 2. Save to Google Sheets
    if (process.env.GOOGLE_SHEETS_CREDENTIALS && process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      try {
        // Handle potential literal newlines in the environment variable string
        const credentialsRaw = process.env.GOOGLE_SHEETS_CREDENTIALS || '';
        // Fix: Aggressively escape all control characters (newlines, tabs, etc.) so JSON.parse succeeds
        const sanitized = credentialsRaw
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        const credentials = JSON.parse(sanitized);
        
        // Robust handling of the private_key formatting (standard fix for Vercel/Production)
        if (credentials.private_key) {
          credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }

        const auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
          range: 'Sheet1!A:D', // Assuming Sheet1 exists with columns: Timestamp, Name, Email, Score
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' }),
              userName,
              userEmail,
              totalScore
            ]]
          }
        });
        console.log("Successfully appended to Google Sheets!");
      } catch (sheetError: any) {
        console.error("Google Sheets Error:", sheetError);
        // We log but don't fail the request to ensure user sees their result
      }
    } else {
      console.warn("Google Sheets credentials or ID missing in environment variables.");
    }

    return NextResponse.json({ success: true, score: totalScore, results: gradedResults });
  } catch (error: any) {
    console.error("Submit Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

