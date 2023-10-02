const createTrending = async function (req, res) {
    let {
        category, imageUrl, buttonText, buttonUrl
    } = req.body;
    console.log(category, imageUrl, buttonText, buttonUrl)
    try {
        console.log(category, imageUrl, buttonText, buttonUrl)
    } catch (error) {
        console.log(error);
        // return errorResponse(res, {
        //     statusCode: 500,
        //     message: "An error occured, pls try again later.",
        // });
    }
}

export {
    createTrending
}