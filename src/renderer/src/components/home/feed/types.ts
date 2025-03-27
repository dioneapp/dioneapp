export interface Script {
	id: string;
	name: string;
	description: string;
	logo_url?: string;
	likes: number;
	tags: string[];
	downloads: number;
}
