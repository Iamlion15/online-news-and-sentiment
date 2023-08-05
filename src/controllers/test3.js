const mongoose = require('mongoose');

async function calculateOverallSentimentPercentage() {
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
          totalArticles: { $sum: '$count' },
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
    let response=[]
    result.forEach(item => {
      const total = item.sentiments.reduce((acc, sentiment) => acc + sentiment.count, 0);
      const positiveCount = item.sentiments.find(sentiment => sentiment.sentiment === 'Positive')?.count || 0;
      const negativeCount = item.sentiments.find(sentiment => sentiment.sentiment === 'Negative')?.count || 0;

      const positivePercentage = (positiveCount / total) * 100 || 0;
      const negativePercentage = (negativeCount / total) * 100 || 0;

      let overallSentiment = '';
      if (positivePercentage > negativePercentage) {
        overallSentiment = 'positive';
      } else if (negativePercentage > positivePercentage) {
        overallSentiment = 'negative';
      } else {
        overallSentiment = 'neutral';
      }
      response.push({"Newspaper":item._id,"Total articles":item.totalArticles,"overall sentiment":overallSentiment,"Positive sentiment":positivePercentage.toFixed(2),"Negative sentiment":negativePercentage.toFixed(2)})
    //   console.log(`Newspaper: ${item._id}`);
    //   console.log(`Total Articles: ${item.totalArticles}`);
    //   console.log(`Overall Sentiment: ${overallSentiment}`);
    //   console.log(`Positive Sentiment: ${positivePercentage.toFixed(2)}%`);
    //   console.log(`Negative Sentiment: ${negativePercentage.toFixed(2)}%`);
    //   console.log('---');
    });
    console.log(response);
  } finally {
    if (connection) {
      connection.disconnect();
    }
  }
}

calculateOverallSentimentPercentage().catch(console.error);
