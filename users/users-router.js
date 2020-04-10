const express = require("express")
const users = require("./users-model")

const router = express.Router()

//This handles the route 'GET /users'
router.get("/", (req, res) => {
    // const options = {
    //     sortBy: req.query.sortBy, //query strings are case sensitive sortby =/= sortby
    //     limit: req.query.limit,
    // }

	users.find(req.query)
		.then((users) => {
			res.status(200).json(users)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error retrieving the users",
			})
		})
})

//This handles the route 'GET /users/:id'
router.get("/:id", (req, res) => {
	users.findById(req.params.id)
		.then((user) => {
			if (user) {
				res.status(200).json(user)
			} else {
				res.status(404).json({
					message: "User not found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error retrieving the user",
			})
		})
})

//This handles the route 'POST /users'
router.post("/", (req, res) => {
	if (!req.body.name || !req.body.email) {
		return res.status(400).json({
			message: "Missing user name or email",
		})
	}

	users.add(req.body)
		.then((user) => {
			res.status(201).json(user)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error adding the user",
			})
		})
})

//This handles the route 'PUT /users/:id'
router.put("/:id", (req, res) => {
	if (!req.body.name || !req.body.email) {
		return res.status(400).json({
			message: "Missing user name or email",
		})
	}

	users.update(req.params.id, req.body)
		.then((user) => {
			if (user) {
				res.status(200).json(user)
			} else {
				res.status(404).json({
					message: "The user could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error updating the user",
			})
		})
})

//This handles the route 'DELETE /users/:id'
router.delete("/:id", (req, res) => {
	users.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The user has been nuked",
				})
			} else {
				res.status(404).json({
					message: "The user could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error removing the user",
			})
		})
})

router.get("/:id/posts", (req,res) => {
    users.findUserPosts(req.params.id)
        .then((posts) => {
            res.json(posts)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Could not get user posts",
            })
        })
})

router.get("/:id/posts/:postId", (req, res) => {
    users.findUserPostById(req.params.id, req.params.postId)
        .then((post) => {
            if (post) {
                res.json(post)
            } else {
                res.status(404).json({
                    message: "Post was not found",
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Could not get user post",
            })
        })
})

router.post("/:id/posts", (req, res) => {
    if(!req.body.text) {
        return res.status(400).json({
            message: "need a value for text",
        })
    }

    users.addUserPost(req.params.id, req.body)
        .then((post) => {
            res.status(201).json(post)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Could not create user post",
            })
        })
})


module.exports = router