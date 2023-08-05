import mongoose from "mongoose"

class statisticsController {
    static async newspaperStatistics(req, res) {
        const collection = mongoose.connection.collection("news");
        const sources = await collection.distinct("source");
        const sentimentCounts = {
            positive: {},
            negative: {},
            neutral: {}
        };

        try {
            for (const source of sources) {
                const pipeline = [
                    { $match: { source: source } },
                    {
                        $group: {
                            _id: "$sentiment",
                            count: { $sum: 1 }
                        }
                    }
                ];

                const result = await collection.aggregate(pipeline).toArray();
                const sentimentCount = {
                    Positive: 0,
                    Negative: 0,
                    Neutral: 0
                };

                for (const sentiment of result) {
                    sentimentCount[sentiment._id] = sentiment.count;
                }

                if (sentimentCount.Positive > 0) {
                    sentimentCounts.positive[source] = sentimentCount.Positive;
                }
                if (sentimentCount.Negative > 0) {
                    sentimentCounts.negative[source] = sentimentCount.Negative;
                }
                if (sentimentCount.Neutral > 0) {
                    sentimentCounts.neutral[source] = sentimentCount.Neutral;
                }
            }
            res.status(200).json(sentimentCounts)
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message)
        }
    }



    //individual newspaper sentiment 
    static async IndividualNewspaperContribution(req, res) {
        const collection = mongoose.connection.collection("news");
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
        try {
            const result = await collection.aggregate(pipeline).toArray();
            let response = []
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
                response.push({ "Newspaper": item._id, "Total articles": item.totalArticles, "overall sentiment": overallSentiment, "Positive sentiment": positivePercentage.toFixed(2), "Negative sentiment": negativePercentage.toFixed(2) })
            });

            res.status(200).json(response)
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    static async newspaperPercentage(req, res) {
        const collection = mongoose.connection.collection("news");
        const sources = await collection.distinct("source");
        const sentimentCounts = {
            Positive: {},
            Negative: {},
            Neutral: {}
        };

        try {
            for (const source of sources) {
                const pipeline = [
                    { $match: { source: source } },
                    {
                        $group: {
                            _id: "$sentiment",
                            count: { $sum: 1 }
                        }
                    }
                ];

                const result = await collection.aggregate(pipeline).toArray();
                const sentimentCount = {
                    Positive: 0,
                    Negative: 0,
                    Neutral: 0
                };

                for (const sentiment of result) {
                    sentimentCount[sentiment._id] = sentiment.count;
                }

                const totalArticles = sentimentCount.Positive + sentimentCount.Negative + sentimentCount.Neutral;

                const sentimentPercentages = {
                    Positive: (sentimentCount.Positive / totalArticles) * 100 || 0,
                    Negative: (sentimentCount.Negative / totalArticles) * 100 || 0,
                    Neutral: (sentimentCount.Neutral / totalArticles) * 100 || 0
                };

                sentimentCounts.Positive[source] = sentimentPercentages.Positive.toFixed(2);
                sentimentCounts.Negative[source] = sentimentPercentages.Negative.toFixed(2);
                sentimentCounts.Neutral[source] = sentimentPercentages.Neutral.toFixed(2);
            }
            res.status(200).json(sentimentCounts);
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    static async newspaperPercentage(req, res) {
        const collection = mongoose.connection.collection("news");
        const sources = await collection.distinct("source");
        const sentimentCounts = {
            positive: {},
            negative: {},
            neutral: {}
        };

        try {
            for (const source of sources) {
                const pipeline = [
                    { $match: { source: source } },
                    {
                        $group: {
                            _id: "$sentiment",
                            count: { $sum: 1 }
                        }
                    }
                ];

                const result = await collection.aggregate(pipeline).toArray();
                const sentimentCount = {
                    Positive: 0,
                    Negative: 0,
                    Neutral: 0
                };

                for (const sentiment of result) {
                    sentimentCount[sentiment._id] = sentiment.count;
                }

                if (sentimentCount.Positive > 0) {
                    sentimentCounts.positive[source] = sentimentCount.Positive;
                }
                if (sentimentCount.Negative > 0) {
                    sentimentCounts.negative[source] = sentimentCount.Negative;
                }
                if (sentimentCount.Neutral > 0) {
                    sentimentCounts.neutral[source] = sentimentCount.Neutral;
                }
            }
            const result = {};

            for (const category in sentimentCounts) {
                result[category] = {};
                const totalArticles = Object.values(sentimentCounts[category]).reduce((acc, count) => acc + count, 0);

                for (const source in sentimentCounts[category]) {
                    result[category][source] = (sentimentCounts[category][source] / totalArticles) * 100;
                }
            }
            res.status(200).json(result)
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message)
        }
    }

}

export default statisticsController;