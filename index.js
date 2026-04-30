require('dotenv').config();

const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1497714649611763752';
const GUILD_ID = '1497301652758073354';
const CHANNEL_ID = '1498701080270213120';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

if (!TOKEN) {
    throw new Error("Missing TOKEN in environment variables");
}

console.log("TOKEN FROM RAILWAY:", process.env.TOKEN);

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'indbetaling') {
        const kommentar = interaction.options.getString('kommentar');
        const beskrivelse = interaction.options.getString('beskrivelse');
        const beløb = interaction.options.getInteger('beløb');

        const channel = await client.channels.fetch(CHANNEL_ID);

        await channel.send(
            `Bruger: ${interaction.user.username} | ` +
            `Kommentar: ${kommentar} | ` +
            `Beskrivelse: ${beskrivelse} | ` +
            `Beløb: ${beløb}`
        );

        await interaction.reply({ content: '✅ Sendt!', ephemeral: true });
    }
});

const commands = [
    new SlashCommandBuilder()
        .setName('indbetaling')
        .setDescription('Opret en indbetaling')
        .addStringOption(opt =>
            opt.setName('kommentar').setDescription('Kommentar').setRequired(true))
        .addStringOption(opt =>
            opt.setName('beskrivelse').setDescription('Beskrivelse').setRequired(true))
        .addIntegerOption(opt =>
            opt.setName('beløb').setDescription('Beløb').setRequired(true))
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
    );

    console.log('Slash command registered');
})();

client.login(TOKEN);