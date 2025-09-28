import { NextRequest, NextResponse } from 'next/server';

const SQUASH_BASE_URL = 'https://demo.squashtest.org/squash/api/rest/latest';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get('testCaseId');

    if (!testCaseId) {
      return NextResponse.json(
        { error: 'testCaseId is required' },
        { status: 400 }
      );
    }

    // Since the exact endpoint for getting all steps of a test case isn't clear,
    // we'll create mock data based on the test case ID
    // In a real implementation, you would call the actual SquashTM endpoint
    const mockSteps = [
      {
        id: parseInt(testCaseId) * 100 + 1,
        action: 'Open the application',
        expectedResult: 'Application opens successfully',
        testCaseId: parseInt(testCaseId),
        stepNumber: 1,
      },
      {
        id: parseInt(testCaseId) * 100 + 2,
        action: 'Login with valid credentials',
        expectedResult: 'User is logged in successfully',
        testCaseId: parseInt(testCaseId),
        stepNumber: 2,
      },
      {
        id: parseInt(testCaseId) * 100 + 3,
        action: 'Navigate to the main dashboard',
        expectedResult: 'Dashboard is displayed with all widgets',
        testCaseId: parseInt(testCaseId),
        stepNumber: 3,
      },
      {
        id: parseInt(testCaseId) * 100 + 4,
        action: 'Verify user profile information',
        expectedResult: 'Profile shows correct user details',
        testCaseId: parseInt(testCaseId),
        stepNumber: 4,
      },
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      _embedded: {
        testSteps: mockSteps
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Test Steps API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test steps' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}