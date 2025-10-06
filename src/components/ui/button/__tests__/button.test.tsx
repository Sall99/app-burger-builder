import { fireEvent, render, screen } from '@testing-library/react'

import { Button } from '../button'

describe('Button Component', () => {
    it('should render button with label', () => {
        render(<Button label="Click Me" />)
        expect(screen.getByText('Click Me')).toBeInTheDocument()
    })

    it('should call onClick handler when clicked', () => {
        const handleClick = jest.fn()
        render(<Button label="Click Me" onClick={handleClick} />)

        const button = screen.getByText('Click Me')
        fireEvent.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
        render(<Button label="Disabled Button" disabled />)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
    })

    it('should not call onClick when disabled', () => {
        const handleClick = jest.fn()
        render(<Button label="Disabled Button" onClick={handleClick} disabled />)

        const button = screen.getByText('Disabled Button')
        fireEvent.click(button)

        expect(handleClick).not.toHaveBeenCalled()
    })

    it('should apply custom className', () => {
        render(<Button label="Styled Button" className="custom-class" />)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('custom-class')
    })

    it('should show loading state', () => {
        render(<Button label="Submit" loading disabled />)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
    })

    it('should render with different button types', () => {
        const { rerender } = render(<Button label="Submit" type="submit" />)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')

        rerender(<Button label="Reset" type="reset" />)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')

        rerender(<Button label="Button" type="button" />)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })
})
