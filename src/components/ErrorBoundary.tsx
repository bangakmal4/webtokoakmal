import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  compact?: boolean;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Terjadi kendala komponen:', error.message, errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.compact) {
      return (
        <div
          role="alert"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-xs bg-stoneSurface border border-borderSubtle rounded-xl shadow-lg p-4 text-xs space-y-2.5"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amberMuted shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-bold text-inkCharcoal">
                {this.props.fallbackTitle || 'Asisten obrolan sedang dimuat ulang'}
              </p>
              <p className="text-textMuted mt-0.5 leading-relaxed">
                Layanan halaman utama tetap berjalan normal. Anda dapat memuat ulang panel chat ini
                atau melanjutkan konsultasi lewat tombol WhatsApp.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emeraldDeep text-white font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang Chat</span>
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-stoneSurface text-inkCharcoal flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-stoneCard border border-borderSubtle rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amberMuted shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h1 className="font-heading font-bold text-lg text-inkCharcoal">
                {this.props.fallbackTitle || 'Terjadi Kendala Tampilan Sementara'}
              </h1>
              <p className="text-sm text-textMuted leading-relaxed">
                Halaman Toko Akmal Banda Aceh mengalami gangguan teknis ringan. Silakan muat ulang
                tampilan untuk melanjutkan konsultasi aksesori laptop &amp; HP Anda.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emeraldDeep text-white text-sm font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Muat Ulang Halaman</span>
          </button>
        </div>
      </div>
    );
  }
}
