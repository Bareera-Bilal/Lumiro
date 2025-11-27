const { uploadToCloudinary } = require("../config/cloudinary")
const { Post } = require("../models/post")


// CREATE POST

const createPost = async (req, res) => {
    try {

        const { postCaption } = req.body
        const file = req.file.path

        let { userId } = req.userId

        const postPicUrl = await uploadToCloudinary(file)
        const newPost = await new Post({ userId, postCaption, postPicUrl })

        await newPost.save()

        return res.status(201).json({ message: "Post created Successfully !" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
}





// REPORT THE Post

const reportPost = async (req, res) => {

    try {

        const { postId } = req.query
        const { userId } = req.user

        let post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: "Post Not found" })

        // Add A NEW REPORT TO THE COMMENT
        comment.reports.push({
            user: userId,
            postId: postId,
            reportedAt: new Date()
        });

        await post.save();

        return res.json({ message: "Post reported successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};




// // LIKE POST

// const likePost = async (res,req) =>
// {

//     try {
//         const {postId} = req.query
//         const {userId} = req.userId

//         let post = await Post.findById(postId)

//         if(post === null){
//             return res.status(404).json({message:"POST NOT FOUND"})
//         }

//         const alreadyLiked = post.likes.includes(userId)

//         if(alreadyLiked){
//            const findIndex = post.likes.indexof(userId)
//            post.likes.splice(findIndex, 1)

//            return res.json({message:"POST LIKED SUCCESSFULLY"})
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }


// LIKE POST WITH ENHANCEMENT OF THE LOGIC IN WHICH POSTID IS ADDED TO LIKESGIVEN ARRAY OF USER

// LIKE POST
const likePost = async (req, res) => {
    try {
        const { postId } = req.query;
        const { userId } = req; 

        // Find post
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "POST NOT FOUND" });
        }

        // Find user
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "USER NOT FOUND" });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {

            // Unlike
            const findIndex = post.likes.indexOf(userId);
            post.likes.splice(findIndex, 1);

            // Remove postId from user's likesGiven
            const userIndex = user.likesGiven.indexOf(postId);
            if (userIndex !== -1) {
                user.likesGiven.splice(userIndex, 1);
            }

            await post.save();
            await user.save();

            return res.json({ message: "POST UNLIKED SUCCESSFULLY" });
        } else {

            // Like
            post.likes.push(userId);

            // Add postId to user's likesGiven
            if (!user.likesGiven.includes(postId)) {
                user.likesGiven.push(postId);
            }

            await post.save();
            await user.save();

            return res.json({ message: "POST LIKED SUCCESSFULLY" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};






// // COMMENT ON POST

// const commentOnPost = async (req, res) => {
//     try {

//         const {postId} = req.query
//         const {userId} = req.user
//         const {text} = req.body

//         let post = await Post.findById(postId)

//         const commentOBJ = {
//             text : text,
//             userId : userId
//         }

//         post.comments.push(commentOBJ)

//         await post.save()

//         return res.json({message : "COMMENTED SUCCESSFULLY"})
//     } catch (error) {
//          console.log(error)
//     }
// }


// COMMENT ON POST WITH ENHANCEMENT OF LOGIC IN WHICH POSTID AND COMMENTID IS ADDED TO COMMENTS GIVEN ARRAY OF USER
const commentOnPost = async (req, res) => {
    try {
        const { postId } = req.query;
        const { userId } = req.user; // assuming middleware attaches user
        const { text } = req.body;

        // Find post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "POST NOT FOUND" });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "USER NOT FOUND" });
        }

        // Create comment object
        const commentOBJ = {
            text,
            userId,
        };

        // Push comment into post
        post.comments.push(commentOBJ);

        // Get the newly created commentId (last element in array)
        const newComment = post.comments[post.comments.length - 1];
        const commentId = newComment._id;

        // Add to user's commentsGiven array
        user.commentsGiven.push({
            postId,
            commentId,
        });

        // Save both
        await post.save();
        await user.save();

        return res.json({ message: "COMMENTED SUCCESSFULLY", commentId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};





// REPORT THE COMMENT 

const reportComment = async (req, res) => {

    try {

        const { postId, commentId } = req.query
        const { userId } = req.user
        const { text } = req.body

        let post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: "Post Not found" })

        const comment = post.comment.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" })

        // Add a new report to the comment
        comment.reports.push({
            user: userId,
            text: text,
            reportedAt: new Date()
        });

        await post.save();

        return res.json({ message: "Comment reported successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};





// EDIT THE COMMENT

const editComment = async (req, res) => {

    try {

        const { postId, commentId } = req.query
        const { userId } = req.user
        const { text } = req.body

        let post = await Post.findById(postId)
        if (!post) return res.status(404).json({ message: "Post Not found" })

        const comment = post.comment.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" })

        if (comment.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this comment" });
        }


        comment.text = text;

        await post.save();

        return res.json({ message: "Comment updated successfully!" });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });

    }

}




// REPORT USER

const reportUser = async (req, res) => {
  try {
    const { reportedUserId } = req.query;   // user being reported
    const { userId } = req.user;            // reporter
    const { reportText } = req.body;        // reason

    // Find reported user
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ message: "REPORTED USER NOT FOUND" });
    }

    // Create report object
    const reportObj = {
      reporterId: userId,
      reportedUserId,
      reportText,
      createdAt: new Date()
    };

    // Save report 
    const report = new Report(reportObj);
    await report.save();

    // Optionally track in reporter’s profile
    const reporter = await User.findById(userId);
    if (reporter) {
      reporter.reportsGiven.push({
        reportedUserId,
        reportId: report._id
      });
      await reporter.save();
    }

    // Send email to reported user
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: reportedUser.email,
      subject: "You have been reported",
      text: `Hello ${reportedUser.username},\n\nYou have been reported for the following reason:\n"${reportText}"\n\nOur team will review this report.\n\nRegards,\nSupport Team`
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: "USER REPORTED AND MAIL SENT SUCCESSFULLY" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};




// FOLLOW / UNFOLLOW USER (toggle)
const toggleFollowUser = async (req, res) => {
  try {
    const { targetUserId } = req.query;   
    const { userId } = req.user;          

    if (userId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }

    const alreadyFollowing = user.following.includes(targetUserId);

    if (alreadyFollowing) {

      // UNFOLLOW
      user.following = user.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);

      await user.save();
      await targetUser.save();

      return res.json({ message: "UNFOLLOWED USER SUCCESSFULLY" });
    } else {
        
      // FOLLOW
      user.following.push(targetUserId);
      targetUser.followers.push(userId);

      await user.save();
      await targetUser.save();

      return res.json({ message: "FOLLOWED USER SUCCESSFULLY" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};


module.exports = { createPost, likePost, commentOnPost }