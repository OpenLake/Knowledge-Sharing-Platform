import { useState, useEffect, useRef } from 'react';
import { Search, ThumbsUp, Edit2, Trash2, MessageCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Upload, FileText, Image, File, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/auth';

interface PYQ {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  course: string;
  description?: string;
  userId: string;
  userName: string;
  createdAt: string;
  upvotes: number;
  comments: Comment[];
  upvotedBy: string[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

interface PYQCardProps {
  pyq: PYQ;
  onUpvote: (id: string, isUpvoting: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddComment: (pyqId: string, comment: string) => void;
  onDeleteComment: (pyqId: string, commentId: string) => void;
  setEditingPYQ: (pyq: Partial<PYQ> | null) => void;
  currentUserId: string | null;
}

const PYQCard = ({ 
  pyq, 
  onUpvote, 
  onEdit, 
  onDelete, 
  onAddComment, 
  onDeleteComment,
  setEditingPYQ, 
  currentUserId 
}: PYQCardProps) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const hasUpvoted = currentUserId && pyq.upvotedBy?.includes(currentUserId);
  const formattedDate = new Date(pyq.createdAt).toLocaleString();

  const toggleComments = () => setExpandedComments(!expandedComments);
  const toggleCommentForm = () => {
    if (!currentUserId) {
      toast.error('Please log in to add comments');
      return;
    }
    setShowCommentForm(!showCommentForm);
  };

  const handleAddComment = () => {
    if (!currentUserId) {
      toast.error('Please log in to add comments');
      return;
    }
    if (!newComment.trim()) return;
    onAddComment(pyq.id, newComment);
    setNewComment('');
    setShowCommentForm(false);
  };

  const handleUpvote = () => {
    if (!currentUserId) {
      toast.error('Please log in to upvote');
      return;
    }
    onUpvote(pyq.id, !hasUpvoted);
  };

  const handleEdit = () => {
    if (!currentUserId) {
      toast.error('Please log in to edit');
      return;
    }
    if (currentUserId !== pyq.userId) {
      toast.error('You can only edit your own uploads');
      return;
    }
    onEdit(pyq.id);
    setEditingPYQ({
      id: pyq.id,
      title: pyq.title,
      course: pyq.course,
      description: pyq.description || '',
      fileUrl: pyq.fileUrl,
      fileType: pyq.fileType
    });
  };

  const handleDelete = () => {
    if (!currentUserId) {
      toast.error('Please log in to delete');
      return;
    }
    if (currentUserId !== pyq.userId) {
      toast.error('You can only delete your own uploads');
      return;
    }
    onDelete(pyq.id);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!currentUserId) {
      toast.error('Please log in to delete comments');
      return;
    }
    
    const comment = pyq.comments.find(c => c.id === commentId);
    if (!comment) return;
    
    if (currentUserId !== comment.userId && currentUserId !== pyq.userId) {
      toast.error('You can only delete your own comments or comments on your uploads');
      return;
    }
    
    onDeleteComment(pyq.id, commentId);
  };

  const getFileIcon = () => {
    switch (pyq.fileType) {
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-10 w-10 text-green-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getFileIcon()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{pyq.title}</h3>
            <p className="text-gray-600">{pyq.course}</p>
            <p className="text-sm text-gray-500">Uploaded by: {pyq.userName}</p>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
        <div>
          <a 
            href={pyq.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            View
          </a>
        </div>
      </div>
      
      {pyq.description && (
        <p className="text-gray-700 mb-4">{pyq.description}</p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 ${
              hasUpvoted ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <ThumbsUp className={`h-4 w-4 ${hasUpvoted ? 'fill-current' : ''}`} />
            <span>{pyq.upvotes}</span>
          </button>
          {currentUserId === pyq.userId && (
            <>
              <button
                onClick={handleEdit}
                className="text-gray-600 hover:text-blue-600"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-600 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">
            Comments ({pyq.comments.length})
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
            {pyq.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-2">No comments yet</p>
            ) : (
              pyq.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded relative">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold">{comment.userName}</p>
                    {(currentUserId === comment.userId ) && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
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

export default function PYQsPage() {
  const { user, loading }: any = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddPYQ, setShowAddPYQ] = useState(false);
  const [editingPYQ, setEditingPYQ] = useState<Partial<PYQ> | null>(null);
  const [pyqs, setPYQs] = useState<PYQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newPYQ, setNewPYQ] = useState({
    title: '',
    course: '',
    description: '',
    fileUrl: '',
    fileType: ''
  });

  useEffect(() => {
    fetchPYQs();
  }, []);

  const fetchPYQs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/db/pyqs');
      if (!response.ok) throw new Error('Failed to fetch PYQs');
      const data = await response.json();
      
      if (!data.pyqs) {
        setPYQs([]);
        return;
      }
      
      setPYQs(data.pyqs);
    } catch (err) {
      console.error('Error fetching PYQs:', err);
      setError('Failed to load PYQs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingFile(true);
    try {
      // Determine file extension and type
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      formData.append('folder', 'pyqs');
      
      // If file is not an image, set resource_type to "raw"
      if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
        formData.append('resource_type', 'raw');
      }
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      
      const res = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setNewPYQ({
          ...newPYQ,
          fileUrl: data.secure_url,
          fileType: fileExtension,
        });
        toast.success('File uploaded successfully!');
      } else {
        throw new Error('Cloudinary upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };
  
  const handleAddPYQ = async () => {
    if (!user) {
      toast.error('Please log in to add a PYQ');
      return;
    }

    if (!newPYQ.title.trim() || !newPYQ.course.trim() || !newPYQ.fileUrl) {
      toast.error('Please fill in all required fields and upload a file');
      return;
    }

    try {
      const response = await fetch('/api/db/pyqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPYQ,
          userId: user.uid,
          userName: user.name || 'Anonymous User',
        }),
      });

      if (!response.ok) throw new Error('Failed to add PYQ');
      
      const addedPYQ = await response.json();
      setPYQs([addedPYQ, ...pyqs]);
      setNewPYQ({ title: '', course: '', description: '', fileUrl: '', fileType: '' });
      setShowAddPYQ(false);
      toast.success('PYQ added successfully!');
    } catch (err) {
      console.error('Error adding PYQ:', err);
      toast.error('Failed to add PYQ');
    }
  };

  const handleUpdatePYQ = async () => {
    if (!user || !editingPYQ || !editingPYQ.id) {
      toast.error('Please log in to update a PYQ');
      return;
    }

    try {
      const response = await fetch('/api/db/pyqs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingPYQ.id,
          userId: user.uid,
          title: editingPYQ.title,
          course: editingPYQ.course,
          description: editingPYQ.description,
        }),
      });

      if (!response.ok) throw new Error('Failed to update PYQ');

      setPYQs(pyqs.map(pyq => {
        if (pyq.id === editingPYQ.id) {
          return {
            ...pyq,
            title: editingPYQ.title || pyq.title,
            course: editingPYQ.course || pyq.course,
            description: editingPYQ.description || pyq.description,
          };
        }
        return pyq;
      }));
      
      setEditingPYQ(null);
      toast.success('PYQ updated successfully!');
    } catch (err) {
      console.error('Error updating PYQ:', err);
      toast.error('Failed to update PYQ');
    }
  };

  const handleDeletePYQ = async (id: string) => {
    if (!user) {
      toast.error('Please log in to delete a PYQ');
      return;
    }

    try {
      const response = await fetch('/api/db/pyqs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, userId: user.uid }),
      });

      if (!response.ok) throw new Error('Failed to delete PYQ');

      setPYQs(pyqs.filter(pyq => pyq.id !== id));
      toast.success('PYQ deleted successfully!');
    } catch (err) {
      console.error('Error deleting PYQ:', err);
      toast.error('Failed to delete PYQ');
    }
  };

  const handleUpvote = async (id: string, isUpvoting: boolean) => {
    if (!user) {
      toast.error('Please log in to upvote');
      return;
    }

    try {
      const pyq = pyqs.find(p => p.id === id);
      if (!pyq) return;

      const updatedUpvotedBy = isUpvoting
        ? [...(pyq.upvotedBy || []), user.uid]
        : (pyq.upvotedBy || []).filter(uid => uid !== user.uid);

      const response = await fetch('/api/db/pyqs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          userId: user.uid,
          upvotes: pyq.upvotes + (isUpvoting ? 1 : -1),
          upvotedBy: updatedUpvotedBy
        }),
      });

      if (!response.ok) throw new Error('Failed to update upvote');

      setPYQs(pyqs.map(p => {
        if (p.id === id) {
          return {
            ...p,
            upvotes: p.upvotes + (isUpvoting ? 1 : -1),
            upvotedBy: updatedUpvotedBy
          };
        }
        return p;
      }));

      toast.success(isUpvoting ? 'Upvoted!' : 'Upvote removed');
    } catch (err) {
      console.error('Error updating upvote:', err);
      toast.error('Failed to update upvote');
    }
  };

  const handleAddComment = async (pyqId: string, commentText: string) => {
    if (!user) {
      toast.error('Please log in to add comments');
      return;
    }
  
    try {
      const pyq = pyqs.find(p => p.id === pyqId);
      if (!pyq) return;
  
      const newComment = {
        id: Math.random().toString(),
        userId: user.uid,
        userName: user.name || 'Anonymous User',
        text: commentText,
        createdAt: new Date().toISOString(),
      };
  
      const response = await fetch('/api/db/pyqs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: pyqId,
          newComment, // Send only the new comment to API
        }),
      });
  
      if (!response.ok) throw new Error('Failed to add comment');
  
      setPYQs(pyqs.map(p =>
        p.id === pyqId ? { ...p, comments: [...p.comments, newComment] } : p
      ));
  
      toast.success('Comment added successfully!');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    }
  };
  

  const handleDeleteComment = async (pyqId: string, commentId: string) => {
    if (!user) {
      toast.error('Please log in to delete comments');
      return;
    }
  
    try {
      const pyq = pyqs.find(p => p.id === pyqId);
      if (!pyq) return;
  
      const commentToDelete = pyq.comments.find(comment => comment.id === commentId);
      if (!commentToDelete) {
        toast.error("Comment not found.");
        return;
      }
  
      if (commentToDelete.userId !== user.uid) {
        toast.error("You can only delete your own comments.");
        return;
      }
  
      const response = await fetch('/api/db/pyqs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: pyqId,
          commentId,
          userId: user.uid, 
        }),
      });
  
      if (!response.ok) throw new Error('Failed to delete comment');
  
      setPYQs(pyqs.map(p =>
        p.id === pyqId
          ? { ...p, comments: p.comments.filter(comment => comment.id !== commentId) }
          : p
      ));
  
      toast.success('Comment deleted successfully!');
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  const itemsPerPage = 4;
  const filteredPYQs = pyqs.filter(pyq =>
    pyq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pyq.course.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredPYQs.length / itemsPerPage);
  const currentPYQs = filteredPYQs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading || isLoading) return <div className="text-center py-48">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Previous Year Question Papers</h1>
          <p className="text-gray-600">Share and access previous year question papers for your courses</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by title or course..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>
          <button
            onClick={() => {
              if (!user) {
                toast.error('Please log in to add a PYQ');
                return;
              }
              setShowAddPYQ(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload PYQ
          </button>
        </div>

        {(showAddPYQ || editingPYQ) && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              {editingPYQ ? 'Edit PYQ' : 'Upload New PYQ'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title *"
                className="w-full p-2 border rounded"
                value={editingPYQ ? editingPYQ.title : newPYQ.title}
                onChange={(e) => 
                  editingPYQ 
                    ? setEditingPYQ({ ...editingPYQ, title: e.target.value })
                    : setNewPYQ({ ...newPYQ, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Course *"
                className="w-full p-2 border rounded"
                value={editingPYQ ? editingPYQ.course : newPYQ.course}
                onChange={(e) => 
                  editingPYQ 
                    ? setEditingPYQ({ ...editingPYQ, course: e.target.value })
                    : setNewPYQ({ ...newPYQ, course: e.target.value })
                }
              />
              <textarea
                placeholder="Description (optional)"
                className="w-full p-2 border rounded h-24"
                value={editingPYQ ? editingPYQ.description : newPYQ.description}
                onChange={(e) => 
                  editingPYQ 
                    ? setEditingPYQ({ ...editingPYQ, description: e.target.value })
                    : setNewPYQ({ ...newPYQ, description: e.target.value })
                }
              />
              
              {!editingPYQ && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  
                  {!newPYQ.fileUrl ? (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload a file (PDF, Word, or Image)
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        {uploadingFile ? 'Uploading...' : 'Select File'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {newPYQ.fileType === 'pdf' && <FileText className="h-6 w-6 text-red-500" />}
                      {['doc', 'docx'].includes(newPYQ.fileType) && <FileText className="h-6 w-6 text-blue-500" />}
                      {['jpg', 'jpeg', 'png'].includes(newPYQ.fileType) && <Image className="h-6 w-6 text-green-500" />}
                      <span className="text-gray-700">File uploaded successfully</span>
                      <button
                        type="button"
                        onClick={() => setNewPYQ({ ...newPYQ, fileUrl: '', fileType: '' })}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={editingPYQ ? handleUpdatePYQ : handleAddPYQ}
                  disabled={uploadingFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {editingPYQ ? 'Update PYQ' : 'Upload PYQ'}
                </button>
                <button
                  onClick={() => {
                    setShowAddPYQ(false);
                    setEditingPYQ(null);
                    setNewPYQ({ title: '', course: '', description: '', fileUrl: '', fileType: '' });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {currentPYQs.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No PYQs found for your search.' : 'No PYQs yet. Be the first to upload one!'}
            </div>
          ) : (
            [...currentPYQs]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) 
            .map((pyq) => (
              <PYQCard
                key={pyq.id}
                pyq={pyq}
                onUpvote={handleUpvote}
                onEdit={(id) => setEditingPYQ(pyqs.find((p) => p.id === id) || null)}
                onDelete={handleDeletePYQ}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                setEditingPYQ={setEditingPYQ}
                currentUserId={user?.uid || null}
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