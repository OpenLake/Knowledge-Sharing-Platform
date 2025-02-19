'use client';

import { useState, useEffect } from 'react';
import { Search, ThumbsUp, Edit2, Trash2, MessageCircle, Star, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { increment } from 'firebase/firestore';

interface Review {
  id: string;
  professorName: string;
  rating: number;
  course: string;
  review: string;
  date: string;
  upvotes: number;
  userId: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  text: string;
  date: string;
}

interface ReviewCardProps {
  review: Review;
  onUpvote: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddComment: (reviewId: string, comment: string) => void;
  setNewReview: (review: { professorName: string; rating: number; course: string; review: string; upvotes: number; }) => void;
}

const ReviewCard = ({ review, onUpvote, onEdit, onDelete, onAddComment, setNewReview }: ReviewCardProps) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const toggleComments = () => setExpandedComments(!expandedComments);
  const toggleCommentForm = () => setShowCommentForm(!showCommentForm);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onAddComment(review.id, newComment);
    setNewComment('');
    setShowCommentForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{review.professorName}</h3>
          <p className="text-gray-600">{review.course}</p>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-5 w-5 ${
                index < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{review.review}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{review.date}</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onUpvote(review.id)}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{review.upvotes}</span>
          </button>
          <button
            onClick={() => {
              onEdit(review.id);
              setNewReview({
                professorName: review.professorName,
                rating: review.rating,
                course: review.course,
                review: review.review,
                upvotes: review.upvotes
              });
            }}
            className="text-gray-600 hover:text-blue-600"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(review.id)}
            className="text-gray-600 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">
            Comments ({review.comments?.length})
          </h4>
          <button
            onClick={toggleComments}
            className="text-gray-600 hover:text-blue-600 flex items-center gap-1"
          >
            {expandedComments ? (
              <>Hide <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Show <ChevronDown className="h-4 w-4" /></>
            )}
          </button>
        </div>

        {expandedComments && (
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {review.comments?.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded">
                <p className="text-gray-700">{comment.text}</p>
                <p className="text-sm text-gray-500 mt-1">{comment.date}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3">
          {!showCommentForm ? (
            <button
              onClick={toggleCommentForm}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <MessageCircle className="h-4 w-4" />
              Add Comment
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 p-2 border rounded"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Post
              </button>
              <button
                onClick={toggleCommentForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function RateProfessor() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddReview, setShowAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newReview, setNewReview] = useState({
    professorName: '',
    rating: 5,
    course: '',
    review: '',
    upvotes: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/db/rateProfDb');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      
      // Handle empty reviews array gracefully
      if (!data.reviews || data.reviews.length === 0) {
        setReviews([]);
        return;
      }
      
      setReviews(data.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      // Don't show error for empty database
      if (err instanceof Error && err.message !== 'Failed to fetch reviews') {
        setError('Failed to load reviews');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async () => {
    try {
      const response = await fetch('/api/db/rateProfDb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) throw new Error('Failed to add review');
      
      const addedReview = await response.json();
      console.log( addedReview )
      setReviews([addedReview, ...reviews]);
      setNewReview({ professorName: '', rating: 5, course: '', review: '' , upvotes: 0 });
      setShowAddReview(false);
    } catch (err) {
      console.error('Error adding review:', err);
    }
  };

  const handleUpdateReview = async (id: string) => {
    try {
      const response = await fetch('/api/db/rateProfDb', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...newReview,
        }),
      });

      if (!response.ok) throw new Error('Failed to update review');

      setReviews(reviews.map(review => {
        if (review.id === id) {
          return {
            ...review,
            ...newReview,
          };
        }
        return review;
      }));
      setEditingReview(null);
      setNewReview({ professorName: '', rating: 5, course: '', review: '' , upvotes:0 });
    } catch (err) {
      console.error('Error updating review:', err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const response = await fetch('/api/db/rateProfDb', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete review');

      setReviews(reviews.filter(review => review.id !== id));
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const response = await fetch('/api/db/rateProfDb', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });
  
      if (!response.ok) throw new Error('Failed to upvote review');
  
      setReviews(reviews.map(review => {
        if (review.id === id) {
          return { ...review, upvotes: review.upvotes + 1 };
        }
        return review;
      }));
    } catch (err) {
      console.error('Error upvoting review:', err);
    }
  };

  const handleAddComment = async (reviewId: string, commentText: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      const newComment = {
        id: Math.random().toString(),
        userId: 'currentUser',
        text: commentText,
        date: new Date().toISOString().split('T')[0]
      };

      const response = await fetch('/api/db/rateProfDb', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reviewId,
          comments: [...review.comments, newComment],
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      setReviews(reviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            comments: [...review.comments, newComment],
          };
        }
        return review;
      }));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const itemsPerPage = 4;
  const filteredReviews = reviews.filter(review =>
    review.professorName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className="text-center py-8">Loading reviews...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rate My Professor</h1>
          <p className="text-gray-600">Share and discover professor reviews from your fellow students</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search professors..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>
          <button
            onClick={() => setShowAddReview(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Review
          </button>
        </div>

        {(showAddReview || editingReview) && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              {editingReview ? 'Edit Review' : 'Add New Review'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Professor Name"
                className="w-full p-2 border rounded"
                value={newReview.professorName}
                onChange={(e) => setNewReview({ ...newReview, professorName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Course Name"
                className="w-full p-2 border rounded"
                value={newReview.course}
                onChange={(e) => setNewReview({ ...newReview, course: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <span>Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  />
                ))}
              </div>
              <textarea
                placeholder="Write your review..."
                className="w-full p-2 border rounded h-32"
                value={newReview.review}
                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
              />
              <div className="flex gap-2">
                <button
                  onClick={editingReview ? () => handleUpdateReview(editingReview) : handleAddReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </button>
                <button
                  onClick={() => {
                    setShowAddReview(false);
                    setEditingReview(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentReviews.length === 0 && !loading ? (
            <div className="col-span-2 text-center py-8 text-gray-500">
              {searchTerm ? 'No reviews found for your search.' : 'No reviews yet. Be the first to add one!'}
            </div>
          ) : (
            currentReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onUpvote={handleUpvote}
                onEdit={setEditingReview}
                onDelete={handleDeleteReview}
                onAddComment={handleAddComment}
                setNewReview={setNewReview}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}