import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from "fs";

function getBase64(filePath) {
  try {
    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(`./public/assets/${filePath}`);

    // Convert the buffer to a Base64 string
    const base64String = fileBuffer.toString("base64");

    return base64String;
  } catch (error) {
    console.error("Error reading file:", error.message);
    return null;
  }
}


/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.userPicturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* POST */

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    posts.forEach((post) => {
      post.picturePath = getBase64(post.picturePath);
      post.userPicturePath = getBase64(post.userPicturePath);
    });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
  }
};
