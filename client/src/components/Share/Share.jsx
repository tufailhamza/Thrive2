import "./Share.scss";
import Image from "../../assets/add.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/AuthContext";
const Share = () => {
  const [file, setFile] = useState(null);
  const [content, setDesc] = useState("");
  const [image_url,setUrl] = useState("");
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
    
      console.log(err);
    }
  };
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newPost) => {
      try {
        const response = await makeRequest.post("/Posts/uploadPost",newPost);
        return response.data; // Assuming your response contains the new post data
      } catch (err) {
        throw err; 
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  

  const handleClick = async (e) => {
    e.preventDefault();
  

    if (!content.trim() && !file) {
   
      console.error("Cannot post an empty content.");
      return;
    }
  
    let image_url;
    if (file) {
      image_url = await upload();
    }
  
    mutation.mutate({ user_id: currentUser.data.user.user_id, content, image_url });
    setDesc("");
    setFile(null);
  };
  
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={ "../../../public/uploads/"+currentUser.data.user.ProfilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.data.user.username}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={content}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
           
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;