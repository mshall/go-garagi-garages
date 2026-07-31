import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { CustomerNotice } from '../domain/types';

export function useCustomerNoticeText(notice?: CustomerNotice): string {
  const { t } = useTranslation();
  if (!notice) return '';
  const time = notice.at
    ? dayjs(notice.at).format('D MMM YYYY, h:mm A')
    : '';
  return t(`notices.${notice.kind}`, { time });
}

export function CustomerNoticeText({ notice }: { notice: CustomerNotice }) {
  return <>{useCustomerNoticeText(notice)}</>;
}
