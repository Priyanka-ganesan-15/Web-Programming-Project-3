/**
 * Project 2 Express server connected to MongoDB 'project2'.
 * Start with: node webServer.js
 * Client uses axios to call these endpoints.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from "mongoose";
// eslint-disable-next-line import/no-extraneous-dependencies
import bluebird from "bluebird";
import express from "express";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import multer from "multer";
import fs from "fs";

// ToDO - Your submission should work without this line. Comment out or delete this line for tests and before submission!
// import models from "./project2/modelData/photoApp.js";

// Load the Mongoose schema for User, Photo, and SchemaInfo
import session from "express-session";
import User from "./schema/user.js";
import Photo from "./schema/photo.js";
import SchemaInfo from "./schema/schemaInfo.js";

//config stuff
const portno = 3001; // Port number to use
const app = express();
app.use(express.json()); //needed to parse bodies ig
app.use(session({ // from slides
    secret: 'none',
    resave: false,
    saveUninitialized: true,
}));
const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');


// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // your React origin
    res.header('Access-Control-Allow-Credentials', 'true'); // needed i think
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


mongoose.Promise = bluebird;
mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project3";
mongoose.connect(MONGODB_URI, {dbName: "project3"})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connect error:", err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
    response.send("Simple web server of files from " + __dirname);
});

//login handler
const requireLogin = (req, res, next) => {
    if (!req.session.loggedInUser) {
        return res.status(401).json({error: "Not logged in"});
    }
    next();
    return 'success';
};


/**
 * /test/info - Returns the SchemaInfo object of the database in JSON format.
 *              This is good for testing connectivity with MongoDB.
 */

app.get("/test/info", async (req, res) => {
    try {
        const info = await SchemaInfo.findOne({}, {__v: 0}).lean();
        if (!info) {
            return res.status(404).send({message: "No schema info."});
        }
        return res.status(200).send(info);
    } catch (err) {
        return res.status(500).send({message: "Server error", error: String(err)});
    }
});

/**
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/counts", requireLogin, async (req, res) => {
    try {
        const [userCount, photoCount, schemaCount] = await Promise.all([
            User.countDocuments({}),
            Photo.countDocuments({}),
            SchemaInfo.countDocuments({})
        ]);
        return res.status(200).send({user: userCount, photo: photoCount, schemaInfo: schemaCount});
    } catch (err) {
        return res.status(500).send({message: "Server error", error: String(err)});
    }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", requireLogin, async (req, res) => {
    try {
        const users = await User.find({}, {_id: 1, first_name: 1, last_name: 1}).lean();
        return res.status(200).send(users);
    } catch (err) {
        return res.status(500).send({message: "Server error", error: String(err)});
    }
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", requireLogin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({message: "Bad user id format"});
        }
        const user = await User.findById(req.params.id, {
            _id: 1,
            first_name: 1,
            last_name: 1,
            location: 1,
            description: 1,
            occupation: 1
        }).lean();
        if (!user) {
            return res.status(400).send({message: "No such user id"});
        }
        return res.status(200).send(user);
    } catch (err) {
        return res.status(500).send({message: "Server error", error: String(err)});
    }
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", requireLogin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({message: "Bad user id format"});
        }

        // Find all photos for the user
        const photos = await Photo.find(
            {user_id: req.params.id},
            {_id: 1, user_id: 1, file_name: 1, date_time: 1, comments: 1}
        ).lean();

        if (!photos || photos.length === 0) {
            return res.status(200).send([]);
        }

        // Gather all distinct comment.user_id values
        const commentUserIds = new Set();
        photos.forEach((photo) => {
            if (photo.comments && Array.isArray(photo.comments)) {
                photo.comments.forEach((comment) => {
                    if (comment.user_id) {
                        commentUserIds.add(comment.user_id.toString());
                    }
                });
            }
        });

        // Fetch those users with specific fields
        const commentUsers = await User.find(
            {_id: {$in: Array.from(commentUserIds)}},
            {_id: 1, first_name: 1, last_name: 1}
        ).lean();

        // Create a map for quick user lookup
        const userMap = {};
        commentUsers.forEach((user) => {
            userMap[user._id.toString()] = user;
        });

        // Build the response with enriched comments
        const result = photos.map((photo) => {
            const enrichedPhoto = {...photo};
            if (photo.comments && Array.isArray(photo.comments)) {
                enrichedPhoto.comments = photo.comments.map((comment) => ({
                    _id: comment._id,
                    comment: comment.comment,
                    date_time: comment.date_time,
                    user: userMap[comment.user_id.toString()] || null
                }));
            }
            return enrichedPhoto;
        });

        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).send({message: "Server error", error: String(err)});
    }
});

/**
 * URL /user/:id/stats - Returns statistics for a user.
 * Returns { photoCount: number, commentCount: number }
 */
app.get("/user/:id/stats", requireLogin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({message: "Bad user id format"});
        }

        const userId = req.params.id;

        // Count photos by this user
        const photoCount = await Photo.countDocuments({user_id: userId});

        // Count comments by this user using aggregation pipeline
        const commentResults = await Photo.aggregate([
            {$unwind: "$comments"},
            {$match: {"comments.user_id": new mongoose.Types.ObjectId(userId)}},
            {$count: "total"}
        ]);

        const commentCount = commentResults.length > 0 ? commentResults[0].total : 0;

        return res.status(200).send({
            photoCount,
            commentCount,
        });
    } catch (err) {
        return res.status(500).send({message: "Server error", error: String(err)});
    }
});

/**
 * URL /commentsOfUser/:id - Returns all comments authored by a user.
 * Returns an array of { photo_id, photo_file_name, photo_owner_id, comment_id, comment, date_time }
 */
app.get("/commentsOfUser/:id", requireLogin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({message: "Bad user id format"});
        }

        const userId = req.params.id;

        const comments = await Photo.aggregate([
            {$unwind: "$comments"},
            {$match: {"comments.user_id": new mongoose.Types.ObjectId(userId)}},
            {
                $project: {
                    photo_id: "$_id",
                    photo_file_name: "$file_name",
                    photo_owner_id: "$user_id",
                    comment_id: "$comments._id",
                    comment: "$comments.comment",
                    date_time: "$comments.date_time",
                    _id: 0,
                },
            },
        ]);

        return res.status(200).send(comments);
    } catch (err) {
        return res.status(500).send({message: "Server error", error: String(err)});
    }
});

app.post("/admin/login", async (req, res) => {
    try {

        const {login_name} = req.body;

        if (!login_name) {
            return res.status(400).json({error: "Missing login_name"});
        }

        const user = await User.findOne({login_name: login_name}).select("-__v");

        if (!user) {
            return res.status(400).json({error: "User not found"});
        }

        //create session later
        req.session.loggedInUser = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            login_name: user.login_name,
        };

        //return user info
        return res.status(200).json(req.session.loggedInUser);
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: "Server error"});
    }
});

app.post("/admin/logout", async (req, res) => {
    try {
        return req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({error: "Logout failed"});
            }
            return res.status(200).json({msg: 'Logged out successfully'});
        });
    } catch (e) {
        return res.status(500).json({error: "Server error"});
    }
});

app.post('/commentsOfPhoto/:photo_id', requireLogin, async (req, res) => {
    try {
        const photoId = req.params.photo_id;
        const {comment} = req.body;

        if (!comment || comment.trim() === "") {
            return res.status(400).json({error: "Comment content is required"});
        }

        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).json({error: "Photo not found"});
        }

        const newComment = {
            comment: comment,
            user_id: req.session.loggedInUser._id,
            date_time: new Date()
        };

        photo.comments.push(newComment);

        await photo.save();
        return res.status(200).json({message: "Comment added", photo});
    } catch (e) {
        console.error("Error adding comment:", e);
        return res.status(500).json({error: "Server error"});
    }
});

app.post("/photos/new", requireLogin, (req, res) => {
    processFormBody(req, res, function (err) {
        if (err || !req.file) {
            return res.status(400).json({error: "No file uploaded"});
        }

        // We need to create the file in the directory "images" under an unique name.
        // We make the original file name unique by adding a unique prefix with a
        // timestamp.
        const timestamp = new Date().valueOf();
        const filename = 'U' + String(timestamp) + req.file.originalname;

        return fs.writeFile(`./images/${filename}`, req.file.buffer, async (e) => {
            if (e) {
                console.error(e);
                return res.status(500).json({error: "Failed to save file"});
            }

            const newPhoto = new Photo({
                file_name: filename,
                user_id: req.session.loggedInUser._id,
                comments: []
            });

            await newPhoto.save();
            return res.status(200).json({message: "Photo uploaded!", photo: newPhoto});
        });
    });
});


const server = app.listen(portno, function () {
    const port = server.address().port;
    console.log(
        "Listening at http://localhost:" +
        port +
        " exporting the directory " +
        __dirname
    );
});
