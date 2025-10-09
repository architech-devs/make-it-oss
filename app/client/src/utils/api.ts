import axios from 'axios'

export interface FileStatus {
    name: string
    exists: boolean
}

interface ApiResponse {
    success: boolean
    files?: FileStatus[]
    message?: string
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export const fetchRepoFiles = async (repoUrl: string): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${BASE_URL}/api/project/fetch-files`, {
            repoUrl
        })

        return response.data
    } catch (error) {
        console.error('API Error:', error)
        return {
            success: false,
            message: "Failed to connect to server. Please try again."
        }
    }
}
