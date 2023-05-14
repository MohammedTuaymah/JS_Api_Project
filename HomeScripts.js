let currentPage = 1
let lastPage = 1


//=== INFINITE SCROLL ===//
window.addEventListener("scroll", function(){

const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
if(endOfPage && currentPage < lastPage)
{
 currentPage = currentPage + 1
 getPosts(false, currentPage)
}
});
//===// INFINITE SCROLL //===//


setupUI()
getPosts()

function userClicked(userId)
{
  window.location = `profile.html?userid=${userId}`
}

function getPosts(reload = true, page = 1)
{
  toggleLoader(true)
  axios.get(`${baseUrl}/posts?limit=6&page=${page}`)
  .then((response) => {
    toggleLoader(false)
    const posts = response.data.data
    lastPage = response.data.meta.last_page
    
    if(reload)
    {
      document.getElementById("posts").innerHTML = ""
    }

    
    for(post of posts)
    {
      console.log(post)

      const author = post.author
      let postTitle = ""

      // show or hide "edit" button
      let user = getCurrentUser()
      let isMyPost = user != null && post.author.id == user.id
      let editBtnContent = ``

      if(isMyPost){
        editBtnContent = `
        <button class='btn btn-secondary' style='float: left' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
        <button class='btn btn-danger' style='margin-left: 5px; float: left' onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
        `
      }

      if(post.title != null)
      {
        postTitle = post.title
      }
      let content = `
        <div class="card text-light" style="background-color: #243447; border-bottom: 1px solid gray;">
            <div onclick="userClicked(${author.id})" class="card-header pb-0 border border-0 p-1">
              
              <div class="d-inline float-end">
                <h6 style="color: rgb(139, 139, 139);" class="d-inline">${post.created_at}</h6>
                <b>${author.username}</b>
                <img src="${author.profile_image}" alt="" class="rounded-circle border border-2" style="width: 40px; height: 40px;">
              </div>

              ${editBtnContent}

            </div>
            <div class="card-body mt-3" style="width: 85%; padding: 1px; margin-left: 9px;" onclick="postClicked(${post.id})">
              <h5 dir="auto">
              ${post.title}
              </h5>
              <p dir="auto">
              ${post.body}
              </p>
              <div class="tags mb-2">
                <p id="post-tags-${post.id}"></p>
              </div>
              <img src="${post.image}" alt="" class="w-100 rounded-3">

              <div style="direction: rtl;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
                <span>
                  (${post.comments_count}) Comments
                </span>
              </div>
            </div>
        </div>
        `
      document.getElementById("posts").innerHTML += content

      const currentPostTagsId = `post-tags-${post.id}`
      document.getElementById(currentPostTagsId).innerHTML = ""

      for(tag of post.tags)
      {
        console.log(tag.name)
        let tagsContent =
        `<p class="text-bg-primary p-1 d-inline rounded-3" style="width: fit-content;">
          ${tag.name}
        </p>
        `
        document.getElementById(currentPostTagsId).innerHTML += tagsContent
      }
    }
  })
}




function postClicked(postId){
  window.location = `postDetails.html?postId=${postId}`
}



function addBtnClicked()
{
  document.getElementById("post-modal-submit-btn").innerHTML = "Create"
  document.getElementById("post-id-input").value = ""
  document.getElementById("post-modal-title").innerHTML = "Create A New Post"
  document.getElementById("post-title-input").value = ""
  document.getElementById("post-body-input").value = ""
  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
  postModal.toggle()
}


