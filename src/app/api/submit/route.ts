import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { google } from 'googleapis';
import { questions } from '@/data/questions';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // In a real scenario, you authenticate with Supabase here
    // const { data: { user }, error } = await supabase.auth.getUser()
    // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { answers, userName, userEmail } = body;

    // 1. Grade the answers
    let score = 0;
    const gradedResults = questions.map((q) => {
      const userAnswer = answers[q.id];
      let isCorrect = false;

      if (q.type === 'mcq') {
        isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) score += 1;
      } else {
        // Simplified Logic grading for Hackathon. In real prod, use isolated runner.
        if (userAnswer && typeof userAnswer === 'string') {
          if (userAnswer.includes('return') && userAnswer.length > 10) {
            score += 1; // Basic heuristic: if they wrote some code with a return
            isCorrect = true;
          }
        }
      }

      return { questionId: q.id, isCorrect, userAnswer };
    });

    const totalScore = `${score}/${questions.length}`;

    // 2. Save to Supabase (Uncomment when Database Tables are ready)
    /*
    await supabase.from('quiz_submissions').insert({
      email: userEmail,
      name: userName,
      score: totalScore,
      answers: JSON.stringify(answers)
    });
    */

    // 3. Save to Google Sheets
    if (process.env.GOOGLE_SHEETS_CREDENTIALS && process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      try {
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
          range: 'Sheet1!A:D', // Assuming Sheet1 exists with columns
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              new Date().toISOString(),
              userName || 'Anonymous',
              userEmail || 'No Email',
              totalScore
            ]]
          }
        });
      } catch (sheetError) {
        console.error("Google Sheets Error:", sheetError);
        // We probably don't want to fail the whole request if sheets fail
      }
    }

    return NextResponse.json({ success: true, score: totalScore, results: gradedResults });
  } catch (error: any) {
    console.error("Submit Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
