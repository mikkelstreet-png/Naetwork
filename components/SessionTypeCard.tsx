import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { DocumentCheckIcon } from './icons/DocumentCheckIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import type { ReactNode } from 'react';

const ICON_MAP: Record<string, ReactNode> = {
  mock_interview: <MicrophoneIcon className="w-7 h-7" />,
  cv_review: <DocumentCheckIcon className="w-7 h-7" />,
  informal_chat: <ChatBubbleIcon className="w-7 h-7" />,
  career_advice: <LightBulbIcon className="w-7 h-7" />,
};

interface SessionTypeCardProps {
  type: string;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

export function SessionTypeCard({ type, title, description, selected, onClick }: SessionTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border rounded-2xl p-5 transition-all ${
        selected
          ? 'border-green-800 bg-green-50'
          : 'border-gray-100 hover:border-gray-300'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`mb-3 ${selected ? 'text-green-800' : 'text-gray-600'}`}>
        {ICON_MAP[type] ?? <MicrophoneIcon className="w-7 h-7" />}
      </div>
      <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </button>
  );
}
