
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// Brand color - Dashboard Navy
				brand: {
					DEFAULT: '#153b60',
					primary: '#153b60',
					light: '#1e4976',
					dark: '#0f2840'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))',
					active: 'hsl(var(--primary-active))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					hover: 'hsl(var(--secondary-hover))',
					light: 'hsl(var(--secondary-light))'
				},
				// Corporate color palette
				corporate: {
					navy: {
						DEFAULT: 'hsl(210, 64%, 23%)',
						50: 'hsl(210, 100%, 97%)',
						100: 'hsl(210, 95%, 94%)',
						200: 'hsl(210, 90%, 88%)',
						300: 'hsl(210, 85%, 75%)',
						400: 'hsl(210, 75%, 50%)',
						500: 'hsl(210, 64%, 23%)',
						600: 'hsl(210, 59%, 30%)',
						700: 'hsl(210, 64%, 17%)',
						800: 'hsl(210, 70%, 12%)',
						900: 'hsl(210, 75%, 8%)'
					},
					gray: {
						DEFAULT: 'hsl(210, 7%, 46%)',
						50: 'hsl(210, 17%, 98%)',
						100: 'hsl(210, 17%, 95%)',
						200: 'hsl(210, 11%, 88%)',
						300: 'hsl(210, 7%, 73%)',
						400: 'hsl(210, 7%, 56%)',
						500: 'hsl(210, 7%, 46%)',
						600: 'hsl(210, 9%, 36%)',
						700: 'hsl(210, 11%, 31%)',
						800: 'hsl(210, 11%, 15%)',
						900: 'hsl(210, 11%, 10%)'
					},
					success: {
						DEFAULT: 'hsl(134, 61%, 41%)',
						50: 'hsl(134, 61%, 95%)',
						100: 'hsl(134, 61%, 85%)',
						500: 'hsl(134, 61%, 41%)',
						600: 'hsl(134, 61%, 35%)',
						700: 'hsl(134, 61%, 28%)'
					},
					info: {
						DEFAULT: 'hsl(211, 100%, 50%)',
						50: 'hsl(211, 100%, 95%)',
						100: 'hsl(211, 100%, 85%)',
						500: 'hsl(211, 100%, 50%)',
						600: 'hsl(211, 100%, 40%)',
						700: 'hsl(211, 100%, 30%)'
					},
					danger: {
						DEFAULT: 'hsl(354, 70%, 54%)',
						50: 'hsl(354, 70%, 95%)',
						100: 'hsl(354, 70%, 85%)',
						500: 'hsl(354, 70%, 54%)',
						600: 'hsl(354, 70%, 45%)',
						700: 'hsl(354, 70%, 35%)'
					},
					warning: {
						DEFAULT: 'hsl(45, 100%, 51%)',
						50: 'hsl(45, 100%, 95%)',
						100: 'hsl(45, 100%, 85%)',
						500: 'hsl(45, 100%, 51%)',
						600: 'hsl(45, 100%, 40%)',
						700: 'hsl(45, 100%, 30%)'
					}
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// User type semantic colors
				industry: {
					50: 'hsl(var(--industry-50))',
					100: 'hsl(var(--industry-100))',
					200: 'hsl(var(--industry-200))',
					300: 'hsl(var(--industry-300))',
					400: 'hsl(var(--industry-400))',
					500: 'hsl(var(--industry-500))',
					600: 'hsl(var(--industry-600))',
					700: 'hsl(var(--industry-700))',
					800: 'hsl(var(--industry-800))',
					900: 'hsl(var(--industry-900))',
					DEFAULT: 'hsl(var(--industry-500))',
					foreground: 'hsl(var(--industry-foreground))'
				},
				expert: {
					50: 'hsl(var(--expert-50))',
					100: 'hsl(var(--expert-100))',
					200: 'hsl(var(--expert-200))',
					300: 'hsl(var(--expert-300))',
					400: 'hsl(var(--expert-400))',
					500: 'hsl(var(--expert-500))',
					600: 'hsl(var(--expert-600))',
					700: 'hsl(var(--expert-700))',
					800: 'hsl(var(--expert-800))',
					900: 'hsl(var(--expert-900))',
					DEFAULT: 'hsl(var(--expert-500))',
					foreground: 'hsl(var(--expert-foreground))'
				},
				vendor: {
					50: 'hsl(var(--vendor-50))',
					100: 'hsl(var(--vendor-100))',
					200: 'hsl(var(--vendor-200))',
					300: 'hsl(var(--vendor-300))',
					400: 'hsl(var(--vendor-400))',
					500: 'hsl(var(--vendor-500))',
					600: 'hsl(var(--vendor-600))',
					700: 'hsl(var(--vendor-700))',
					800: 'hsl(var(--vendor-800))',
					900: 'hsl(var(--vendor-900))',
					DEFAULT: 'hsl(var(--vendor-500))',
					foreground: 'hsl(var(--vendor-foreground))'
				},
				admin: {
					50: 'hsl(var(--admin-50))',
					100: 'hsl(var(--admin-100))',
					200: 'hsl(var(--admin-200))',
					300: 'hsl(var(--admin-300))',
					400: 'hsl(var(--admin-400))',
					500: 'hsl(var(--admin-500))',
					600: 'hsl(var(--admin-600))',
					700: 'hsl(var(--admin-700))',
					800: 'hsl(var(--admin-800))',
					900: 'hsl(var(--admin-900))',
					DEFAULT: 'hsl(var(--admin-500))',
					foreground: 'hsl(var(--admin-foreground))'
				},
				// Status semantic colors
				status: {
					success: 'hsl(var(--status-success))',
					warning: 'hsl(var(--status-warning))',
					error: 'hsl(var(--status-error))',
					info: 'hsl(var(--status-info))',
					pending: 'hsl(var(--status-pending))'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace']
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }]
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
				'144': '36rem'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				'strong': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-subtle': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.9'
					}
				},
				'slide-in-from-top': {
					'0%': {
						transform: 'translateY(-100%)'
					},
					'100%': {
						transform: 'translateY(0)'
					}
				},
				'slide-in-from-bottom': {
					'0%': {
						transform: 'translateY(100%)'
					},
					'100%': {
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
				'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'flow-1': 'flow-dots-1 4s ease-in-out infinite',
				'flow-2': 'flow-dots-2 4s ease-in-out infinite',
				'flow-3': 'flow-dots-3 4s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'pulse-flow-down': 'pulse-flow-down 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
