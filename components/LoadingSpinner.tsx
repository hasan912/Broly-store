export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full" style={{ border: '4px solid #e7e5e4' }} />
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '4px solid transparent', borderTopColor: '#6366f1', borderRightColor: '#8b5cf6' }} />
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)' }} />
        </div>
        <p className="font-medium" style={{ color: '#57534e' }}>Loading...</p>
      </div>
    </div>
  );
}
