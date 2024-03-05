import { environment } from '@env/environment';

export function getAvatar(avatar?: string): string {
  return avatar
    ? `${environment.serverUrl}/files?id=${avatar}`
    : '../../../assets/images/avatar.png';
}

export function getImage(image: string): string {
  return `${environment.serverUrl}/files?id=${image}`;
}
