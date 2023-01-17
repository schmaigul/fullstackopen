import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from  './Blog'

const blog = {
  title: 'Testing is being executed',
  author: 'Test Tester',
  url: 'test.com',
  likes: 200,
  user: {
    username: 'tester',
    name: 'Testing Boss',
  }
}

const testUser = {
  username: 'tester',
  name: 'Testing Boss'
}

test('renders content', () => {

  render(<Blog blog = {blog} />)

  const title = screen.queryByText('Testing is being executed')
  expect(title).toBeDefined()

  const author = screen.queryByText('Test Tester')
  expect(author).toBeDefined()

  const url = screen.queryByText('test.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('200')
  expect(likes).toBeNull()
})

test('url and likes shown after button is clicked', async () => {

  render(<Blog blog = {blog} user = {testUser} />)
  const user = userEvent.setup()
  const button = screen.queryByText('view')
  await user.click(button)

  const url = screen.queryByText('test.com')
  expect(url).toBeDefined()

  const likes = screen.queryByText('200')
  expect(likes).toBeDefined()
})

test('event handler called twice when likes are clicked', async () => {
  const mockHandler = jest.fn()

  render(<Blog blog = {blog} user = {testUser}  updateLikes = {mockHandler}></Blog>)

  const user = userEvent.setup()
  const button = screen.queryByText('view')
  await user.click(button)

  const likeButton = screen.queryByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})