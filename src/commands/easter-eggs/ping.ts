import type { Line } from '../../types';

export function ping(args: string[]): Line[] {
  const host = args[0] ?? 'unknown';
  const ms = (): string => (3 + Math.random() * 2).toFixed(3);

  return [
    { text: `PING ${host}: 56 data bytes` },
    { text: `64 bytes from ${host}: icmp_seq=1 ttl=64 time=${ms()} ms`, delayMs: 600 },
    { text: `64 bytes from ${host}: icmp_seq=2 ttl=64 time=${ms()} ms`, delayMs: 600 },
    { text: `64 bytes from ${host}: icmp_seq=3 ttl=64 time=3.141 ms`, delayMs: 600 },
    { text: `64 bytes from ${host}: icmp_seq=4 ttl=64 time=${ms()} ms`, delayMs: 600 },
    { text: '\u00A0', delayMs: 400 },
    { text: `--- ${host} ping statistics ---` },
    { text: `4 packets transmitted, 4 received, 0% packet loss`, style: 'dim' },
  ];
}
