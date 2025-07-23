import { ThreadList } from './components/ThreadList'
import { CreateThread } from './components/CreateThread'
import axios from 'axios';
import './forum.css'
export default async function ForumPage({params}:{
    params:Promise<{
        courseid: string;
    }>
}) {
    const courseId = (await params).courseid
    const forum = await axios.get(`http://localhost:5000/forums/course/${courseId}`,{withCredentials:true})
    // console.log("aaaaa :" + JSON.stringify(forum.data._id))
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Forum</h1>
      <CreateThread forumId={forum.data._id}/>
        <ThreadList courseId={courseId}/>
    </div>
  )
}

