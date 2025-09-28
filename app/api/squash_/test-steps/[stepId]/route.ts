import { NextRequest, NextResponse } from 'next/server';

const SQUASH_BASE_URL = 'https://demo.squashtest.org/squash/api/rest/latest';
const SQUASH_AUTH_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwidXVpZCI6IjA0Zjc0NTc5LTg0YTAtNDQ0MS04OTNmLTY4NDEzZDI3YmFjMyIsInBlcm1pc3Npb25zIjoiUkVBRF9XUklURSIsImlhdCI6MTc1ODg5NTAwMiwiZXhwIjoxNzkwMjk0NDAwfQ.GM9kkdH9ML7GsAF10KsFzCj8uMewNcV5qVzF-sTFsabssETEd0gS2qjxBhSV13_AO1Umxga0Y8emo5LhJ8oZpA';

export async function GET(
  request: NextRequest,
  { params }: { params: { stepId: string } }
) {
  try {
    const { stepId } = params;

    const response = await fetch(
      `${SQUASH_BASE_URL}/test-steps/${stepId}`,
      {
        headers: {
          'Authorization': `Bearer ${SQUASH_AUTH_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching test step:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test step' },
      { status: 500 }
    );
  }
}