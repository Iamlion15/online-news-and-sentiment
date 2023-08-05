const mongoose = require('mongoose');

async function calculateSentimentPercentage() {
  let connection = null;
  try {
    connection = await mongoose.connect("mongodb://localhost:27017/rnews", { useNewUrlParser: true });
    console.log("DATABASE CONNECTED");

    const collection = connection.connection.collection("news"); // Replace with your collection name

    const pipeline = [
      {
        $group: {
          _id: { source: '$source', sentiment: '$sentiment' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.source',
          sentiments: {
            $push: {
              sentiment: '$_id.sentiment',
              count: '$count'
            }
          }
        }
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();

    result.forEach(item => {
      const total = item.sentiments.reduce((acc, sentiment) => acc + sentiment.count, 0);
      const positiveCount = item.sentiments.find(sentiment => sentiment.sentiment === 'Positive')?.count || 0;
      const positivePercentage = (positiveCount / total) * 100 || 0;

      console.log(`Newspaper: ${item._id}, Positive Sentiment: ${positivePercentage.toFixed(2)}%`);
    });
  } finally {
    if (connection) {
      connection.disconnect();
    }
  }
}

calculateSentimentPercentage().catch(console.error);
