import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updated parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()
  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Koulu on tyhmää')
  await user.type(authorInput, 'Linus Torvalds')
  await user.type(urlInput, 'testing.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Koulu on tyhmää')
  expect(createBlog.mock.calls[0][0].author).toBe('Linus Torvalds')
  expect(createBlog.mock.calls[0][0].url).toBe('testing.com')
})