import { useSelector } from "react-redux"
import CreatePost from "../../components/createPost"

export default function ProfileRight({ setVisible, eachUserProfile }){
    const { user } = useSelector( state => ({...state}) )

    return (
        <CreatePost user={user} setVisible={setVisible} eachUserProfile={eachUserProfile} margin/>
    )
}