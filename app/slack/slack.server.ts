// Define the type for the data to add to Slack
export interface SlackMessageData {
  userId: string;
  userName: string;
  userEmail: string;
  feedback: Record<string, string | number>;
}

// Helper function to send a message to Slack
export async function sendToSlack(data: SlackMessageData, slack_webhook_url: string): Promise<void> {
  const messageText = formatSlackMessage(data);

  const response = await fetch(slack_webhook_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      text: messageText,
    }),
  });

  if (!response.ok) {
    const result: any = await response.json();
    throw new Error(result.error || 'Failed to send message to Slack');
  }
}

// Function to format the message for Slack based on SlackMessageData
function formatSlackMessage(data: SlackMessageData): string {
  let feedbackMessage = `*User ID:* ${data.userId}\n*User Name:* ${data.userName}\n*User Email:* ${data.userEmail}\n\n*Feedback:*\n`;
  for (const [key, value] of Object.entries(data.feedback)) {
    feedbackMessage += `• *${key}:* ${value}\n`;
  }
  return feedbackMessage;
}
