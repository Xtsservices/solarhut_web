#!/bin/bash

# Test script for the fixed DELETE contact endpoint

echo "🧪 Testing REAL DELETE Contact Endpoint"
echo "========================================"
echo ""

API_URL="http://localhost:3300/api/contacts"

echo "📡 Testing: DELETE $API_URL/:id"
echo ""

# First, let's get some contacts to see what IDs exist
echo "1. Getting existing contacts..."
response=$(curl -s "$API_URL" -H "Content-Type: application/json")
echo "Contacts response: $response"
echo ""

# Test the DELETE endpoint with a real ID (you'll need to replace this with an actual ID)
TEST_ID="10"
echo "2. Testing DELETE with ID: $TEST_ID"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE "$API_URL/$TEST_ID" -H "Content-Type: application/json")

# Extract HTTP status
http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
response_body=$(echo "$response" | sed '/HTTP_STATUS:/d')

echo "HTTP Status: $http_status"
echo "Response Body: $response_body"
echo ""

if [ "$http_status" = "200" ]; then
    echo "✅ SUCCESS: Contact deleted from database!"
    echo "Now when you refresh the page, the contact should stay deleted."
elif [ "$http_status" = "404" ]; then
    echo "⚠️  Contact not found (ID $TEST_ID doesn't exist)"
    echo "Try with a different ID from the contacts list above."
elif [ "$http_status" = "000" ]; then
    echo "❌ FAILED: Backend server not running"
    echo "Please start your backend server first."
else
    echo "⚠️  Received HTTP status: $http_status"
    echo "Check your backend server and route implementation."
fi

echo ""
echo "3. Verifying deletion - getting contacts again..."
response=$(curl -s "$API_URL" -H "Content-Type: application/json")
echo "Updated contacts response: $response"
echo ""