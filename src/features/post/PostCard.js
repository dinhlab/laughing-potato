import { useState } from 'react'
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { fDate } from '../../utils/formatTime'
import PostReaction from './PostReaction'
import CommentForm from '../comment/CommentForm'
import CommentList from '../comment/CommentList'
import useAuth from '../../hooks/useAuth'
import { deletePost } from './postSlice'
import EditForm from './EditForm'
function AlertDialog ({ open, handleClose, handleDeletePost }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Click OK to delete
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeletePost}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}
function PostCard ({ post }) {
  const [isEditing, setIsEditing] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [openAlert, setOpenAlert] = useState(false)
  const { user } = useAuth()
  const dispatch = useDispatch()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleDeletePost = () => {
    dispatch(deletePost(post._id, post.author._id))
  }
  const cancelEdit = () => {
    setAnchorEl(null)
    setIsEditing(false)
  }
  return (
    <>
      {isEditing
        ? (
          <EditForm cancelEdit={cancelEdit} post={post} />
          )
        : (
          <>
            <AlertDialog
              open={openAlert}
              handleClose={() => setOpenAlert(false)}
              handleDeletePost={handleDeletePost}
            />
            <Card>
              <CardHeader
                disableTypography
                avatar={<Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />}
                title={
                  <Link
                    variant='subtitle2'
                    color='text.primary'
                    component={RouterLink}
                    sx={{ fontWeight: 600 }}
                    to={`/user/${post.author._id}`}
                  >
                    {post?.author?.name}
                  </Link>
                }
                subheader={
                  <Typography variant='caption' sx={{ display: 'block', color: 'text.secondary' }}>
                    {fDate(post.createdAt)}
                  </Typography>
                }
                action={
                  user._id === post.author._id && (
                    <>
                      <IconButton onClick={handleClick}>
                        <MoreVertIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                      <Menu
                        id='basic-menu'
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button'
                        }}
                      >
                        <MenuItem onClick={() => setIsEditing(true)}>Edit post</MenuItem>
                        <MenuItem onClick={() => setOpenAlert(true)}>Delete post</MenuItem>
                      </Menu>
                    </>
                  )
                }
              />
              <Stack spacing={2} sx={{ p: 3 }}>
                <Typography>{post.content}</Typography>
                {post.image && (
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      height: 300,
                      '& img': { objectFit: 'cover', width: 1, height: 1 }
                    }}
                  >
                    <img src={post.image} alt='post' />
                  </Box>
                )}
                <PostReaction post={post} />
                <CommentList postId={post._id} />
                <CommentForm postId={post._id} />
              </Stack>
            </Card>
          </>
          )}
    </>
  )
}
export default PostCard
