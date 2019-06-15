import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';
import './Feed.css';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

export class Feed extends Component {
  state = {
    feeds: []
  };

  async componentDidMount() {
    const posts = await api.get('posts');
    this.setState({ feeds: posts.data });
    this.registerToSocket();
  }

  registerToSocket = () => {
    const socket = io(api.defaults.baseURL);

    socket.on('post', newPost => {
      this.setState({ feeds: [newPost, ...this.feeds] });
    });

    socket.on('like', likedPost => {
      this.setState({
        feeds: this.state.feeds.map(post => (post._id === likedPost._id ? likedPost : post))
      });
    });
  };

  handleLike = id => {
    api.post(`/posts/${id}/likes`);
  };

  render() {
    return (
      <section id="post-list">
        {this.state.feeds.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{post.author}</span>
                <span className="place">{post.place}</span>
              </div>

              <img src={more} alt="more" />
            </header>

            <img src={`http://localhost:3333/files/${post.image}`} alt="user_img" />

            <footer>
              <div className="actions">
                <button onClick={() => this.handleLike(post._id)}>
                  <img src={like} alt="like" />
                </button>

                <img src={comment} alt="comment" />
                <img src={send} alt="send" />
              </div>

              <strong>{post.likes} curtidas</strong>

              <p>
                {post.description}
                <span>{post.hashtags}</span>
              </p>
            </footer>
          </article>
        ))}
      </section>
    );
  }
}

export default Feed;
