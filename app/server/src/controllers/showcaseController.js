import { approveSubmission, getCurrentShowcase, getSubmittedRepo, rejectSubmission, submitRepo } from "../services/showCaseService.js";
import { getFeaturedShowcases } from "../services/showCaseService.js";
import { errorResponse, successResponse } from "../utils/response.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




/**
 * @route POST /api/showcase/submit
 * @desc Submit a new GitHub repository for review
 * @access Public
 * 
 * @body {string} repoUrl - The GitHub repository URL (must include 'github.com')
 * @body {string} description - Description of the project
 * @body {string} email - Submitter's valid email address
 * 
 * @returns {object} 200 - Successfully submitted repository
 * @returns {object} 400 - Invalid repo URL or email
 * @returns {object} 404 - Repository not found on GitHub
 * @returns {object} 409 - Repository already submitted (duplicate)
 * @returns {object} 500 - Internal server error
 */


export const Submission = async (req, res) => {

    const { repoUrl, description, email } = req.body;

    try {
            if (!repoUrl || !repoUrl.includes('github.com')) {
                return errorResponse(res, "Invalid GitHub URL", 400);
            }

            if(!email || !emailRegex.test(email)){
                return errorResponse(res, "Enter a valid email address", 400);
            }

            const submission =  await submitRepo(repoUrl, description, email);
            return successResponse(res, submission, "Repository submitted successfully!");

    } catch (error) {
        console.log("Submission error", error);


        if (error.code == "11000") {
            return errorResponse(res, "Submission already included.", 409);
        }
        if (error.message === "Repository not found.") {
           return errorResponse(res, error.message, 404)
        }
        if (error.message === "Invalid GitHub URL"){
           return errorResponse(res, error.message, 400);
        }
        return errorResponse(res, "Internal server error", 500);
        
    }
}



/**
 * @route GET /api/showcase/submissions
 * @desc Get all submissions (paginated, filterable by status)
 * @access Admin Only
 * 
 * @query {number} page - Page number for pagination (default: 1)
 * @query {number} limit - Number of items per page (default: 5)
 * @query {string} filter - Submission status: "pending", "approved", "rejected" (default: "pending")
 * 
 * @returns {object} 200 - Paginated list of submissions with metadata
 * @returns {object} 500 - Internal server error
 */

export const getSubmissions = async (req, res) => {

    try{
        //get pagination querys
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        let statusFilter = req.query.filter || "pending";

        if(!["pending", "rejected", "approved"].includes(statusFilter)){
            console.log(true);
            statusFilter = "pending";
        }

        //handling pagination in showaseService.js
        const submission =  await getSubmittedRepo(page, limit, statusFilter);
        return successResponse(res, submission, "Data received successfully");
        
    }catch(err){
        console.log("getSubmissions Error", err);
        return errorResponse(res, "Internal server error", 500);
    }
    
}


/**
 * @route PUT /api/showcase/submissions/:id/approve
 * @desc Approve a pending submission and assign a week number
 * @access Admin Only
 * 
 * @param {string} id - Submission ID (MongoDB ObjectId)
 * @body {number} weekNumber - The week number the submission is featured in
 * @body {string} adminNotes - Notes from the admin about the approval
 * 
 * @returns {object} 200 - Successfully approved submission
 * @returns {object} 400 - Invalid input (missing ID, invalid week number, or short admin notes)
 * @returns {object} 404 - Submission not found
 * @returns {object} 500 - Internal server error
 */

export const submitApprovedSubmission = async (req, res) => {
  let { id } = req.params;
  const { weekNumber, adminNotes } = req.body;

  
  try {
    if (!id) {
      return errorResponse(res, "Valid id is required." , 400);
    }

    if (!weekNumber || isNaN(weekNumber)) {
      
      return errorResponse(res, "Valid week number is required.", 400);
    }

    if (!adminNotes || adminNotes.length < 4) {
      return errorResponse(res, "Valid admin notes are required." , 400);
    }

    id = id.split("=")[1]
    
    // call service
    const result = await approveSubmission(id, weekNumber, adminNotes);

    if (!result) {
      return errorResponse(res, "Submission not found.", 404);
    }

    return successResponse(res, result, "Repository accepted successfully");
  } catch (error) {
    console.error("Approve submission error:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};



/**
 * @route PUT /api/showcase/submissions/:id/reject
 * @desc Reject a pending submission with admin notes
 * @access Admin Only
 * 
 * @param {string} id - Submission ID (MongoDB ObjectId)
 * @body {number} weekNumber - Week number when reviewed
 * @body {string} adminNotes - Notes from the admin explaining rejection
 * 
 * @returns {object} 200 - Successfully rejected submission
 * @returns {object} 400 - Invalid input (missing ID, invalid week number, or short admin notes)
 * @returns {object} 404 - Submission not found
 * @returns {object} 500 - Internal server error
 */

export const submitRejectedSubmission = async (req, res) => {
  let { id } = req.params;
  const { weekNumber, adminNotes } = req.body;

  
  try {
    if (!id) {
      return errorResponse(res, "Valid id is required." , 400);
    }

    if (!weekNumber || isNaN(weekNumber)) {
      return errorResponse(res, "Valid week number is required.", 400);
    }

    if (!adminNotes || adminNotes.length < 4) {
      return errorResponse(res, "Valid admin notes are required." , 400);
    }

    id = id.split("=")[1]
    
    // call service
    const result = await rejectSubmission(id, weekNumber, adminNotes);

    if (!result) {
      return errorResponse(res, "Submission not found.", 404);
    }

    return successResponse(res, result, "Repository rejected successfully");
  } catch (error) {
    console.error("Reject submission error:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};



/**
 * @route GET /api/showcase/current
 * @desc Gets the current weeks showcased repository
 * @access Public
 * 
 * @returns {object} 200 - Successfully got the repository
 * @returns {object} 404 - No showcased repository
 * @returns {object} 500 - Internal server error
 */

export const getCurrentWeekShowcase = async (req, res) => {

     try {

      const currentShowcase = await getCurrentShowcase();
      
      if (currentShowcase.length == 0) {
         return errorResponse(res, "No showcased repository for this week.", 404);
      }

      return successResponse(res, currentShowcase, "Successfully recieved the repository")
    } catch (error) {

      console.error("Get current showcase error:", error);

      return errorResponse(res, "Internal Server Error", 500);
  }
}



/**
 * @route GET /api/showcase/featured
 * @desc Gets all the featured repository
 * @access Public
 * 
 * @returns {object} 200 - Successfully got the repository
 * @returns {object} 404 - No featured repository
 * @returns {object} 500 - Internal server error
 */

export const getFeaturedSubmission = async (req, res) => {

    try {

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const featured = await getFeaturedShowcases( page, limit );
      if(featured.data == 0){
        return errorResponse(res, "No featured repositories found.", 404);
      }
      return successResponse(res, featured, "Fetched featured repositories");
      
    } catch (error) {
        console.log("Featured error: ", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}