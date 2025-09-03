import { render, screen } from '@testing-library/react';
import MobileLayout from '../MobileLayout';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { it } from 'zod/locales';
import { describe } from 'node:test';

describe('MobileLayout', () => {
  it('renders children correctly', () => {
    render(
      <MobileLayout>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MobileLayout className="custom-class">
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('shows progress indicator when showProgress is true', () => {
    render(
      <MobileLayout showProgress currentStep={1}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.getByText('마라톤 정보')).toBeInTheDocument();
  });

  it('does not show progress indicator by default', () => {
    render(
      <MobileLayout>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    expect(screen.queryByText('마라톤 정보')).not.toBeInTheDocument();
  });

  it('applies correct padding when progress is shown', () => {
    const { container } = render(
      <MobileLayout showProgress currentStep={1}>
        <div>Test Content</div>
      </MobileLayout>
    );
    
    const contentContainer = container.querySelector('.max-w-md');
    // Check if the container has the expected classes or at least doesn't have py-6
    expect(contentContainer).not.toHaveClass('py-6');
    expect(contentContainer).toHaveClass('px-4');
  });
});