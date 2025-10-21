import ShowcaseSubmission from "../models/showcaseSubmissions.js";
import { getOctokitInstance } from "./githubService.js";



function parseGitHubUrl(repoUrl) {
    let url = repoUrl.replace(/^https?:\/\//, "");
    const parts = url.split("/");
    if (parts.length < 3) throw new Error("Invalid GitHub URL");
    return { url, owner: parts[1], repo: parts[2] };
}

//To submit the repository
export const submitRepo = async (repoUrl, description, email) => {
   
   try {
        //Get owner name and repo name
        const { url, owner, repo } = parseGitHubUrl(repoUrl);
        
        const octokit = await getOctokitInstance();
        const {data} = await octokit.rest.repos.get({
            owner, 
            repo
        });

        
        //github metadata
        const metadata = {
        owner,
        repoName: data.name,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        };

        
        //Adding to mongoDB database
        const submission = new ShowcaseSubmission({
            repoUrl : url,
            owner,
            repoName: repo,
            submitterEmail: email,
            description: description,
            submissionDate: Date.now(),
            status : "pending",
            metadata
        });

        return submission.save();
   } catch (error) {
       if (error.status === 404) {
          throw new Error("Repository not found.");
       }
       
   }
}



export const getSubmittedRepo = async ( page, limit, statusFilter ) => {
     try {
        const skip = (page - 1) * limit;
        
        //filter by status
        const filter = {};
        if (statusFilter && ["pending","approved","rejected"].includes(statusFilter)) {
            filter.status = statusFilter;
        }

        //sorting in desc order by submission date
        const sortBy = "submissionDate";
        const sortOrder = -1;
        const submissions = await ShowcaseSubmission.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        const total = await ShowcaseSubmission.countDocuments(filter);

        //return the response
        return {
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalSubmissions: total,
            submissions
        };
        
     } catch (error) {
        console.log("Get Submissions error: ", error);
        throw new error;
     }
}


export const approveSubmission = async (id, weekNumber, adminNotes) => {
  try {

    const submission = await ShowcaseSubmission.findById(id);
    if (!submission) return null;

     
    submission.status = "approved";
    submission.weekNumber = weekNumber;
    submission.adminNotes = adminNotes || "";
    

    await submission.save();

    return {
      message: "Submission approved successfully.",
      submission,
    };
  } catch (error) {
    console.error("approveSubmission error:", error);
    throw error; 
  }
};




export const rejectSubmission = async (id, weekNumber, adminNotes) => {
  try {

    const submission = await ShowcaseSubmission.findById(id);
    if (!submission) return null;

     
    submission.status = "rejected";
    submission.weekNumber = weekNumber;
    submission.adminNotes = adminNotes || "";
    

    await submission.save();

    return {
      message: "Submission rejected successfully.",
      submission,
    };
  } catch (error) {
    console.error("rejectSubmission error:", error);
    throw error; 
  }
};


const getCurrentWeek = () => {

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil((diff + start.getDay() * 24 * 60 * 60 * 1000) / oneWeek);
    
}


export const getCurrentShowcase = async () => {
      try{

          // Get the current week number
        const currentWeek = getCurrentWeek();

        // Find the approved submission for this week
        const submission = await ShowcaseSubmission.find({
          status: "approved",
          weekNumber: currentWeek
        }).lean();

        return submission;
      }catch(error){
          console.log("currentShowcase Error: ", error);
          throw error;
      }
}


//To get featured repositories
export const getFeaturedShowcases = async (page, limit) => {
    try {
        const skip = (page - 1) * limit;
    
        //sorting in desc order by week number
        const sortBy = "weekNumber";
        const sortOrder = -1;
        const featured = await ShowcaseSubmission.find({ "status" : "approved" })
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        const total = await ShowcaseSubmission.countDocuments({ "status" : "approved" });

        //return the response
        return {
            metadata: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            },
            data: featured
        };
        
     } catch (error) {
        console.log("Get Submissions error: ", error);
        throw new error;
     }
}