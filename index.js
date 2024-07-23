// @ts-nocheck
const appDiv = document.getElementById('app');
const commentBtn = document.getElementById('comment-btn');

commentBtn.addEventListener('click', () => {
  const input = document.getElementById('initial-comment').value;
  const newCmt = getComment(input, null);
  COMMENTS.push(newCmt);
  render();
});

const getComment = (data, parent) => {
  return {
    id: Date.now(),
    data: data,
    parent: parent,
    child: [],
  };
};

const COMMENTS = [
  {
    id: 1,
    data: 'This is comment 1',
    parent: null,
    child: [2],
  },
  {
    id: 2,
    data: 'This is comment 2',
    parent: 1,
    child: [],
  },
  {
    id: 3,
    data: 'This is comment 3',
    parent: null,
    child: [],
  },
];

const onReplySubmitClick = (id) => {
  const input = document.getElementById(`reply-${id}`).value;
  const newCmt = getComment(input, id);

  COMMENTS.push(newCmt);

  if (id !== null) {
    const parent = COMMENTS.find((cmt) => cmt.id === id);
    parent.child.push(newCmt.id);
  }

  render();
};

const generateReplyBox = (id) => {
  return `
  		<div>
      	<input type="text" id="reply-${id}" />
  			<button onclick=onReplySubmitClick(${id})>Submit</button>
      </div>
`;
};

const onReplyClick = (id) => {
  const replyBox = generateReplyBox(id);
  const replyDivId = document.getElementById(`reply-div-${id}`);
  if (replyDivId) replyDivId.innerHTML = replyBox;
};

const generateComment = (cmt) => {
  return `
	<div class=commentBoxContainer>
  	<p> ${cmt.data} </p>
    <div id=reply-div-${cmt.id}>
    	<button onclick=onReplyClick(${cmt.id}) >
    		reply
   		</button>
     </div>
  </div>
`;
};

const generateCommentGroup = (data) => {
  let commentsHtml = `<li>
  ${generateComment(data)}
  </li>`;

  if (data.child.length > 0) {
    commentsHtml += '<ul>';
    data.child.forEach((id) => {
      const childComment = COMMENTS.find((cmt) => cmt.id === id);
      commentsHtml += generateCommentGroup(childComment);
    });
    commentsHtml += '</ul>';
  }

  return commentsHtml;
};

const render = () => {
  let html = '<ul class=parent-list>';
  COMMENTS.forEach((cmt) => {
    if (!cmt.parent) {
      html += generateCommentGroup(cmt);
    }
  });
  html += '</ul>';
  if (appDiv) appDiv.innerHTML = html;
};

document.addEventListener('DOMContentLoaded', () => {
  render();
});
