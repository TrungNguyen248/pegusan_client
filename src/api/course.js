import axios from 'axios'

const BASE_URL_API = 'http://localhost:5000/v1/api'
const API_KEY =
    'f19a5a8992310cd9dfcc8ce99fca99a2a1e5f28a4f3049f83c112565992066270310a4e5628169ad6e0ed6b113386f8a2a1be3e1c3ba0b6c61ceeb97f0ec8b61'

const courseApi = {
    getLessonListByIdCourse: async ({
        courseId,
        isHina,
        userId,
        accessToken,
    }) => {
        try {
            const res = await axios.post(
                `${BASE_URL_API}/lesson/all`,
                {
                    course_id: courseId,
                    isHina: isHina,
                },
                {
                    headers: {
                        'x-api-key': API_KEY,
                        'x-client-id': userId,
                        authorization: accessToken,
                    },
                },
            )
            return res.data
        } catch (error) {
            return error.response?.data
        }
    },
}

export default courseApi
