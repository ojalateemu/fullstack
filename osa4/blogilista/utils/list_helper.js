const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce( (sum, x) => sum + x.likes, 0 )
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        const result = []
        return result
    }

    return blogs.reduce( (fav, x) => fav.likes > x.likes ? fav : x )
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        const result = []
        return result
    }

    const counts = {}

    blogs.forEach( (x) => {
        counts[x.author] = (counts[x.author] || 0) + 1
    })

    const maxAuthor = Object.keys(counts).reduce( (a, b) => counts[a] > counts[b] ? a : b )
    const maxCount = counts[maxAuthor]

    return { author: maxAuthor, blogs: maxCount }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        const result = []
        return result
    }

    const likes = {}

    blogs.forEach( (x) => {
        likes[x.author] = (likes[x.author] || 0) + x.likes
    })

    const maxAuthor = Object.keys(likes).reduce( (a, b) => likes[a] > likes[b] ? a : b )
    const maxLikes = likes[maxAuthor]

    return { author: maxAuthor, likes: maxLikes }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }