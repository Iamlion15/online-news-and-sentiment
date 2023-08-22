import mongoose from "mongoose"
import userModel from "../model/usersModel";
import reviewModel from "../model/newsReview";
import newsModel from "../model/newsModel";
import privilegeModel from "../model/privilegeModel";

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
                response.push({ "Newspaper": item._id, "Totalarticles": item.totalArticles, "overallSentiment": overallSentiment, "PositiveSentiment": positivePercentage.toFixed(2), "NegativeSentiment": negativePercentage.toFixed(2) })
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

    static async countArticles(req, res) {
        const collection = mongoose.connection.collection("news");

        try {
            const totalArticles = await collection.countDocuments();
            res.status(200).json({ totalArticles });
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    static async countUserReviews(req, res) {
        const nid = req.body.nid
        try {
            const user = await userModel.findOne({ nID: nid })
            try {
                const userReviewCount = await reviewModel.countDocuments({ user: user._id });
                res.status(200).json({ userReviewCount });
            } catch (error) {
                console.log(error);
                res.status(500).json(error.message);
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
    static async calculateAverageReviewsPerArticle(req, res) {
        try {
            const totalReviewCount = await reviewModel.countDocuments();
            const totalArticleCount = await newsModel.countDocuments(); // Assuming you have a news model
            let averageReviewsPerArticle;

            if (totalArticleCount === 0) {
                averageReviewsPerArticle = 0;
            }

            averageReviewsPerArticle = totalReviewCount / totalArticleCount;
            const ReviewsPerArticle = averageReviewsPerArticle.toFixed(2);

            res.status(200).json(ReviewsPerArticle);
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    static async getNewspaperSentimentCounts(req, res) {
        const newspaperName = req.body.newspaperName;
        try {
            const collection = mongoose.connection.collection("news");
            const pipeline = [
                { $match: { source: newspaperName } },
                {
                    $group: {
                        _id: "$sentiment",
                        count: { $sum: 1 }
                    }
                }
            ];

            const result = await collection.aggregate(pipeline).toArray();

            const sentimentCounts = {
                Positive: 0,
                Negative: 0
            };

            for (const sentiment of result) {
                if (sentiment._id === "Positive") {
                    sentimentCounts.Positive = sentiment.count;
                } else if (sentiment._id === "Negative") {
                    sentimentCounts.Negative = sentiment.count;
                }
            }

            res.status(200).json(sentimentCounts);
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    static async getReviewsInDateRange(req, res) {
        const { startDate, endDate } = req.body;
        const totalNewsArticle = await newsModel.countDocuments();
    
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
    
            const reviews = await reviewModel.find({
                date: { $gte: start, $lte: end }
            }).populate("user");
    
            const reviewerMap = new Map(); // To store unique reviewer IDs with their names
    
            reviews.forEach(review => {
                const reviewerId = review.user._id.toString();
                const reviewerFirstName = review.user.firstname;
                const reviewerLastName = review.user.lastname;
    
                if (!reviewerMap.has(reviewerId)) {
                    reviewerMap.set(reviewerId, { firstName: reviewerFirstName, lastName: reviewerLastName });
                }
            });
    
            const totalReviewers = reviewerMap.size;
    
            const reviewers = [...reviewerMap.values()].map(reviewer => ({
                firstName: reviewer.firstName,
                lastName: reviewer.lastName
            }));
    
            res.status(200).json({ totalReviewers, totalReviews: reviews.length, totalNewsArticle, reviewers });
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    static async getUsersWithReviewStatus(req, res) {
        try {
            // Step 1: Fetch users with "GRANTED" privilege
            const grantedUsers = await privilegeModel.find({ privilege: "GRANTED" }).populate("user");
            
            // Step 2: Fetch distinct user IDs who have reviewed
            const reviewedUsers = await reviewModel.distinct("user");
    
            // Step 3 and 4: Process each user with "GRANTED" privilege
            const usersWhoReviewed = [];
            const usersWhoNotReviewed = [];
    
            grantedUsers.forEach(userPrivilege => {
                const user = userPrivilege.user;
                console.log(user)
                const hasReviewed = reviewedUsers.toString().includes(user._id.toString());
                console.log(hasReviewed)
                const userDetails = {
                    firstName: user.firstname,
                    lastName: user.lastname
                };
    
                if (hasReviewed) {
                    usersWhoReviewed.push(userDetails);
                } else {
                    usersWhoNotReviewed.push(userDetails);
                }
            });
    
            res.status(200).json({
                usersWhoReviewed,
                usersWhoNotReviewed
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }

    static async getReviewedNewsArticlesCount(req, res) {
        try {
            // Fetch the count of distinct news articles with reviews
            const totalNewsArticle = await newsModel.countDocuments();
            const reviewedNewsArticles = await reviewModel.distinct("news");
            const reviewedNewsArticlesCount = reviewedNewsArticles.length;
            const NoReviewedArticlesCount=totalNewsArticle-reviewedNewsArticlesCount
    
            res.status(200).json({ reviewedNewsArticlesCount,totalNewsArticle,NoReviewedArticlesCount });
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    static async getSentimentReviewCounts(req, res) {
        try {
            // Fetch the distinct news articles that have been reviewed
            const reviewedNewsArticles = await reviewModel.distinct("news");
    
            // Fetch the count of news articles with "Negative" and "Positive" sentiment that have been reviewed
            const sentimentReviewCounts = {
                negative: 0,
                positive: 0
            };
    
            // Iterate through reviewed news articles and count sentiment occurrences
            for (const newsArticleId of reviewedNewsArticles) {
                const newsArticle = await newsModel.findById(newsArticleId);
    
                if (newsArticle) {
                    if (newsArticle.sentiment === "Negative") {
                        sentimentReviewCounts.negative++;
                    } else if (newsArticle.sentiment === "Positive") {
                        sentimentReviewCounts.positive++;
                    }
                }
            }
    
            res.status(200).json(sentimentReviewCounts);
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }
    static async getUserCountsByPrivilege(req, res) {
        try {
            // Get the count of all registered users
            const totalRegisteredUsers = await privilegeModel.countDocuments();

            // Get the count of users with "GRANTED" privilege
            const grantedUsersCount = await privilegeModel.countDocuments({ privilege: "GRANTED" });

            // Get the count of users with "NO_ACCESS" privilege
            const noAccessUsersCount = await privilegeModel.countDocuments({ privilege: "NO_ACCESS" });

            res.status(200).json({
                totalRegisteredUsers,
                grantedUsersCount,
                noAccessUsersCount
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    }    
}

export default statisticsController;