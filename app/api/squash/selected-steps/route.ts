import { NextRequest, NextResponse } from 'next/server';
import { SelectedTestSteps } from '@/types/squash';

// In a real application, you would store this in a database
let selectedStepsStore: SelectedTestSteps[] = [];

export async function GET() {
  try {
    return NextResponse.json(selectedStepsStore);
  } catch (error) {
    console.error('Error fetching selected steps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch selected steps' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SelectedTestSteps = await request.json();
    
    // Find existing entry for this test case
    const existingIndex = selectedStepsStore.findIndex(
      item => item.testCaseId === body.testCaseId
    );

    if (existingIndex >= 0) {
      // Update existing entry
      selectedStepsStore[existingIndex] = body;
    } else {
      // Add new entry
      selectedStepsStore.push(body);
    }

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Error saving selected steps:', error);
    return NextResponse.json(
      { error: 'Failed to save selected steps' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get('testCaseId');

    if (testCaseId) {
      selectedStepsStore = selectedStepsStore.filter(
        item => item.testCaseId !== parseInt(testCaseId)
      );
    } else {
      selectedStepsStore = [];
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting selected steps:', error);
    return NextResponse.json(
      { error: 'Failed to delete selected steps' },
      { status: 500 }
    );
  }
}