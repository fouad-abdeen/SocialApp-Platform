import { environment } from '@env/environment';

export function getAvatar(avatar?: string): string {
  return avatar
    ? `${environment.serverUrl}/files?id=${avatar}`
    : '/assets/images/avatar.png';
}

export function getImage(image: string): string {
  return `${environment.serverUrl}/files?id=${image}`;
}

export function calculatePassedMinutes(dateString: string) {
  const date = new Date(dateString),
    now = new Date();
  const differenceInMilliseconds = now.getTime() - date.getTime();
  const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
  return differenceInMinutes;
}
