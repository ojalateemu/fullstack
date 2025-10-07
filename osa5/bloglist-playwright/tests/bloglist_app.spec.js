const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      const errorDiv = page.getByText('Wrong username or password')

      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test blog for playwright testing', 'Test-author', 'http://test.com')
      await expect(page.getByText('Test blog for playwright testing Test-author')).toBeVisible()
    })

    describe('Testing blog liking and removing functions', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Test blog for playwright testing', 'Test-author', 'http://test.com')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted by the user who created it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        const removeButton = page.getByRole('button', { name: 'remove' })
        await expect(removeButton).toBeVisible()

        page.on('dialog', dialog => dialog.accept())

        await removeButton.click()

        await expect(page.getByText('Test blog for playwright testing Test-author')).not.toBeVisible()
        await expect(page.getByText('Blog "Test blog for playwright testing" by Test-author was deleted successfully')).toBeVisible()
      })

      test('only the creator of the blog sees the remove button', async ({ page, request }) => {
        await page.getByRole('button', { name: 'view' }).click()
        const removeButton = page.getByRole('button', { name: 'remove' })
        await expect(removeButton).toBeVisible()
        await page.getByRole('button', { name: 'logout' }).click()

        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Tester',
            username: 'test',
            password: 'password'
          }
        })
        await loginWith(page, 'test', 'password')

        await page.getByRole('button', { name: 'view' }).click()
        await expect(removeButton).not.toBeVisible()
      })
    })

    describe('testing with several blogs', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First blog', 'First-author', 'http://first.com')
        await createBlog(page, 'Second blog', 'Second-author', 'http://second.com')
        await createBlog(page, 'Third blog', 'Third-author', 'http://third.com')
      })

      test('the blogs are sorted correctly: blog with most likes is shown first', async ({ page }) => {
        const blog3 = page.locator('.blog').filter({ hasText: 'Third blog' }).getByRole('button')
        const blog2 = page.locator('.blog').filter({ hasText: 'Second blog' }).getByRole('button')

        await blog3.click()
        await blog2.click()

        const likeButton3 = page.locator('.blog').filter({ hasText: 'Third blog' }).getByRole('button', { name: 'like' })
        const likeButton2 = page.locator('.blog').filter({ hasText: 'Second blog' }).getByRole('button', { name: 'like' })
        
        await likeButton3.click()
        await likeButton3.click()
        await likeButton2.click()

        const blogs = page.locator('.blog')
        await expect(blogs.nth(0)).toContainText('Third blog')
        await expect(blogs.nth(1)).toContainText('Second blog')
        await expect(blogs.nth(2)).toContainText('First blog')
      })
    })
  })
})