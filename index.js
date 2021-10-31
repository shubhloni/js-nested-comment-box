// Get Comments from Database (Browser Local Storage)
let oldCommentsArray = [];
function onLoad() {
  let commentsJson = localStorage.getItem('commentsArr');
  if (commentsJson) {
    oldCommentsArray = JSON.parse(commentsJson);
    console.log(oldCommentsArray);
  }
}
onLoad();

let commentsArray = [];

// Render on Webpage
function renderPage(newComment) {
  // Generate the new HTML for each comment
  let newHtml = `
        <li>
        <div id=comment-${newComment.id} class='comments'>
            <b>${newComment.author}</b>
        <br>
            <div class="comment">${newComment.comment}</div>
        
        <a href="#" role="button" id="reply-${newComment.id}">reply</a>
        </div>
        </li>
    `;

  // If there is a Child comment for the Comment then render them with Recursively calling renderPage()
  if (newComment.child.length != 0) {
    // Add ul tag to seprate the Child comments with it's parents comments in the view
    newHtml += `<ul>`;
    newComment.child.forEach((commentId) => {
      newHtml += renderPage(oldCommentsArray[commentId]);
    });
    newHtml += `</ul>`;
  }

  // return the generated view (each comment list) do that it is not opverwritten by next comment
  return newHtml;
}

// Store Comments into the local storage in the form of Array of objects (comments)
function storeComment(commentsArray) {
  let jsonComments = JSON.stringify(commentsArray);
  localStorage.setItem('commentsArr', jsonComments);
}

// Add event listener at the DOMContentLoaded Event so the comments would be displayed after the DOM is loaded
// and there won't be any ambuiguity if DOM is mmodified by JS code
document.addEventListener(
  'DOMContentLoaded',
  (params) => {
    renderComments();
    let commentsList = document.getElementById('comments-list');

    // Add event listner to all comments at the one.
    // So adding event to each component is avoided.
    // We can retrieve which component is clicked by the event parameter passed in callback function
    commentsList.addEventListener(
      'click',
      (event) => {
        // event.target.nodeName gives the node (HTML Tag) which is clicked
        if (
          event.target.nodeName === 'A' ||
          event.target.nodeName === 'BUTTON'
        ) {
          // event.target.id gives the ID of the element clicked
          let clickId = event.target.id;
          let recordId = event.target.id.split('-')[1];

          // If the element clicked is Reply then render the input text and button
          if (clickId.includes('reply')) {
            // Generate the new HTML for new Reply comment box and submit button
            let newHtml = `
                    <ul>
                    <li>
                    <div class="comment-input-row">
                        <input type = "text" id = "content-${
                          event.target.id.split('reply-')[1]
                        }" >
                        <button id = "rplbtn-${
                          event.target.id.split('reply-')[1]
                        }" >Submit</button>
                    </div>
                    </li>
                    <ul>
                    `;

            // Display at the place where click has happen
            let commentId = document.getElementById(event.target.id);
            commentId.innerHTML += newHtml;
          } else if (clickId.includes('rplbtn')) {
            // Get data from input fields after submit button is pressed
            let content = document.getElementById(`content-${recordId}`).value;
            let author = 'SL';
            addComment(author, content, recordId);
          }
        }
        // After any event, JS just kind of reloads the page. To stop this use below function.
        event.preventDefault();
      },
      false
    );

    // false parameter would stop the Event Capturing
  },
  false
);

// Function to Add and store the new reply or comment to the main array
function addComment(author, content, id) {
  // Create new comment object and push it to main comments array
  let newRpl = {
    id: oldCommentsArray.length,
    author: author,
    comment: content,
    parent: id,
    child: [],
  };
  oldCommentsArray.push(newRpl);

  // If parent of the new created comment is there, then keep the child referance to the Child Array
  if (id != null) {
    oldCommentsArray[id].child.push(oldCommentsArray.length - 1);
  }

  console.log(oldCommentsArray);
  storeComment(oldCommentsArray);
  renderComments();
}

// Renders all comments
function renderComments() {
  let commentList = '';
  oldCommentsArray.forEach((comment) => {
    if (comment.parent === null || comment.parent == 'null') {
      commentList += renderPage(comment);
    }
  });

  // Display at the desired position by getting parent element
  let commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = commentList;
}

// Sumbit comment for the main comment box
function submitComment() {
  let comment = document.getElementById('comment-box').value;
  let author = 'SL';
  addComment(author, comment, null);
  document.getElementById('comment-box').value = '';
}
