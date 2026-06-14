/**
 * Open Wegram Bot - Cloudflare Worker
 * Two-way private messaging + RSS Feeds + Ads
 * 
 * GitHub Repository: https://github.com/ayed22288-max/open-wegram-bot
 */

import { handleRequest } from './core.js';
import { handleTelegramCommand } from './telegram-bot.js';
import { checkAllFeeds } from './rss-parser.js';
import { initDB } from './db-manager.js';

export default {
    async fetch(request, env, ctx) {
        // تهيئة قاعدة البيانات
        initDB(env.DB);

        const url = new URL(request.url);
        const path = url.pathname;

        // مسار أوامر RSS من تليجرام
        if (path === '/rss-webhook') {
            return handleTelegramCommand(request, env, ctx);
        }

        // مسار الفحص اليدوي للأخبار
        if (path === '/check-rss') {
            await checkAllFeeds(env, ctx);
            return new Response('RSS check completed', { status: 200 });
        }

        // الوظيفة الأصلية للبوت (التراسل الثنائي)
        const config = {
            prefix: env.PREFIX,      // لاحظ: في الكود الأصلي كان REFLECT_PREFIX
            secretToken: env.SECRET_TOKEN
        };
        return handleRequest(request, config);
    }
};
