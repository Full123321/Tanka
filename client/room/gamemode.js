// ============================================
//   РЕЖИМ "тяночка занята!"
//   1 команда | бесконечное время | админ 971A66BA801843CF
// ============================================

var CREATOR_ID = "971A66BA801843CF";

Room.PopupsEnable = true;

// --- 1 КОМАНДА ---
var mainTeam = Teams.Add("Blue", "Строители", { r: 50, g: 150, b: 255 });
mainTeam.Spawns.SpawnPointsGroups.Add(1);

// --- ВХОД В КОМАНДУ + ВЫДАЧА РОЛИ ---
Teams.OnRequestJoinTeam.Add(function(player, team) {
  team.Add(player);
  if (IsAdmin(player)) {
    GiveAdmin(player);
  } else {
    GiveDefault(player);
  }
});

Teams.OnPlayerChangeTeam.Add(function(player) {
  player.Spawns.Spawn();
});

// --- РЕСПАУН ---
Spawns.GetContext().RespawnTime.Value = 0;

// --- НАЗВАНИЕ РЕЖИМА ---
Properties.GetContext().GameModeName.Value = "тяночка занята!";
Ui.GetContext().Hint.Value = "тяночка занята! Строй, фармь, покупай! /help — все команды и зоны";

// --- РАЗРУШАЕМОСТЬ ---
BreackGraph.BreackAll = true;
BreackGraph.OnlyPlayerBlocksDmg = false;
BreackGraph.WeakBlocks = false;

// --- ЛИДЕРБОРД ---
LeaderBoard.PlayerLeaderBoardValues = [
  { Value: "Scores", DisplayName: "Coins", ShortDisplayName: "🪙" },
  { Value: "Kills", DisplayName: "Kills", ShortDisplayName: "K" },
  { Value: "Deaths", DisplayName: "Deaths", ShortDisplayName: "D" },
  { Value: "Spawns", DisplayName: "Spawns", ShortDisplayName: "S" }
];

// --- СТРОИТЕЛЬНЫЕ ИНСТРУМЕНТЫ ДЛЯ ВСЕХ ---
Build.GetContext().BuildModeEnable.Value = true;
Build.GetContext().Pipette.Value = true;
Build.GetContext().FloodFill.Value = true;
Build.GetContext().FillQuad.Value = true;
Build.GetContext().RemoveQuad.Value = true;
Build.GetContext().BalkLenChange.Value = true;
Build.GetContext().SetSkyEnable.Value = true;
Build.GetContext().GenMapEnable.Value = true;
Build.GetContext().ChangeCameraPointsEnable.Value = true;
Build.GetContext().QuadChangeEnable.Value = true;
Build.GetContext().CollapseChangeEnable.Value = true;
Build.GetContext().RenameMapEnable.Value = true;
Build.GetContext().ChangeMapAuthorsEnable.Value = true;
Build.GetContext().LoadMapEnable.Value = true;
Build.GetContext().ChangeSpawnsEnable.Value = true;
Build.GetContext().BlocksSet.Value = BuildBlocksSet.AllClear;

// --- ИНВЕНТАРЬ ПО УМОЛЧАНИЮ (обычные игроки) ---
var invCtx = Inventory.GetContext();
invCtx.Main.Value = false;
invCtx.Secondary.Value = false;
invCtx.Melee.Value = true;        // лопата
invCtx.Explosive.Value = false;
invCtx.Build.Value = true;
invCtx.BuildInfinity.Value = true; // бесконечные блоки
invCtx.MainInfinity.Value = false;
invCtx.SecondaryInfinity.Value = false;
invCtx.ExplosiveInfinity.Value = false;

// ============================================
//   ФУНКЦИИ
// ============================================
function IsAdmin(player) {
  return player.id === CREATOR_ID || player.Id === CREATOR_ID;
}

function GiveAdmin(player) {
  player.Inventory.Main.Value = true;
  player.Inventory.MainInfinity.Value = true;
  player.Inventory.Secondary.Value = true;
  player.Inventory.SecondaryInfinity.Value = true;
  player.Inventory.Melee.Value = true;
  player.Inventory.Explosive.Value = true;
  player.Inventory.ExplosiveInfinity.Value = true;
  player.Inventory.Build.Value = true;
  player.Inventory.BuildInfinity.Value = true;
  player.Build.BuildModeEnable.Value = true;
  player.Build.FlyEnable.Value = true;
  player.Build.Pipette.Value = true;
  player.Build.FloodFill.Value = true;
  player.Build.FillQuad.Value = true;
  player.Build.RemoveQuad.Value = true;
  player.Build.BalkLenChange.Value = true;
  player.Build.SetSkyEnable.Value = true;
  player.Build.GenMapEnable.Value = true;
  player.Build.ChangeCameraPointsEnable.Value = true;
  player.Build.QuadChangeEnable.Value = true;
  player.Build.CollapseChangeEnable.Value = true;
  player.Build.RenameMapEnable.Value = true;
  player.Build.ChangeMapAuthorsEnable.Value = true;
  player.Build.LoadMapEnable.Value = true;
  player.Build.ChangeSpawnsEnable.Value = true;
  player.Build.BlocksSet.Value = BuildBlocksSet.AllClear;
  player.Damage.DamageIn.Value = false;
  player.PopUp("🛡 ТЫ АДМИН! Всё бесконечное!");
  player.Ui.Hint.Value = "Админ! /help — все команды и зоны";
}

function GiveDefault(player) {
  player.Inventory.Main.Value = false;
  player.Inventory.Secondary.Value = false;
  player.Inventory.Melee.Value = true;
  player.Inventory.Explosive.Value = false;
  player.Inventory.Build.Value = true;
  player.Inventory.BuildInfinity.Value = true;
  player.Inventory.MainInfinity.Value = false;
  player.Inventory.SecondaryInfinity.Value = false;
  player.Inventory.ExplosiveInfinity.Value = false;
  player.Build.FlyEnable.Value = false;
  player.Damage.DamageIn.Value = true;
  player.PopUp("Добро пожаловать! У тебя только лопата. Фармь монеты и покупай!");
  player.Ui.Hint.Value = "Фарм → Магазин. /help — все команды и зоны";
}

// --- ПРИ СПАВНЕ ПЕРЕВЫДАЁМ АДМИНКУ ---
Spawns.OnSpawn.Add(function(player) {
  if (IsAdmin(player)) {
    GiveAdmin(player);
  }
  player.Properties.Spawns.Value = (player.Properties.Spawns.Value || 0) + 1;
});

// ============================================
//   ЗОНЫ ФАРМА МОНЕТ
// ============================================
function setupFarm(tag, viewTag, cost, color) {
  var area = AreaPlayerTriggerService.Get(tag);
  area.Tags = [tag];
  area.Enable = true;
  area.OnEnter.Add(function(p) {
    p.Properties.Scores.Value += cost;
    p.Ui.Hint.Value = "+" + cost + " 🪙";
  });
  var view = AreaViewService.GetContext().Get(viewTag);
  view.Tags = [tag];
  view.Color = color;
  view.Enable = true;
}

setupFarm("farm1", "farm1View", 10, { r: 255, g: 255, b: 0 });
setupFarm("farm2", "farm2View", 50, { r: 255, g: 200, b: 0 });
setupFarm("farm3", "farm3View", 100, { r: 255, g: 150, b: 0 });

// ============================================
//   ЗОНЫ МАГАЗИНА
// ============================================
function buyCheck(player, cost, successMsg, failMsg) {
  if (player.Properties.Scores.Value >= cost) {
    player.Properties.Scores.Value -= cost;
    player.PopUp(successMsg);
    player.Ui.Hint.Value = successMsg;
    return true;
  } else {
    player.Ui.Hint.Value = failMsg;
    return false;
  }
}

function setupBuy(tag, viewTag, cost, success, color, callback) {
  var area = AreaPlayerTriggerService.Get(tag);
  area.Tags = [tag];
  area.Enable = true;
  area.OnEnter.Add(function(p) {
    if (IsAdmin(p)) { p.Ui.Hint.Value = "У админа уже всё есть"; return; }
    if (buyCheck(p, cost, success, "Нужно " + cost + " 🪙")) {
      callback(p);
    }
  });
  var view = AreaViewService.GetContext().Get(viewTag);
  view.Tags = [tag];
  view.Color = color;
  view.Enable = true;
}

setupBuy("buyWeapon", "buyWeaponView", 100, "🔫 Основное оружие куплено!", { r: 255, g: 0, b: 0 }, function(p) { p.Inventory.Main.Value = true; });
setupBuy("buySecondary", "buySecondaryView", 50, "🔫 Вторичное оружие куплено!", { r: 200, g: 0, b: 0 }, function(p) { p.Inventory.Secondary.Value = true; });
setupBuy("buyInfWeapon", "buyInfWeaponView", 300, "∞ Бесконечные патроны!", { r: 150, g: 0, b: 150 }, function(p) { p.Inventory.MainInfinity.Value = true; p.Inventory.SecondaryInfinity.Value = true; });
setupBuy("buyExplosive", "buyExplosiveView", 200, "💣 Взрывчатка куплена!", { r: 100, g: 100, b: 0 }, function(p) { p.Inventory.Explosive.Value = true; });
setupBuy("buyFly", "buyFlyView", 500, "🪽 Полёт куплен!", { r: 0, g: 255, b: 255 }, function(p) { p.Build.FlyEnable.Value = true; });
setupBuy("buyHp", "buyHpView", 150, "❤ HP увеличен до 200!", { r: 0, g: 255, b: 0 }, function(p) { p.contextedProperties.MaxHp.Value = 200; });
setupBuy("buySkin", "buySkinView", 250, "👕 Скин куплен!", { r: 255, g: 0, b: 255 }, function(p) { p.contextedProperties.SkinType.Value = 1; });
setupBuy("buyBlocks", "buyBlocksView", 100, "🧱 Все блоки открыты!", { r: 100, g: 100, b: 100 }, function(p) { p.Build.BlocksSet.Value = BuildBlocksSet.AllClear; });

// ============================================
//   БОТЫ (только админ)
// ============================================
var botT = AreaPlayerTriggerService.Get("botSpawn");
botT.Tags = ["botSpawn"];
botT.Enable = true;
botT.OnEnter.Add(function(p) {
  if (IsAdmin(p)) {
    Bots.Spawn(1, 1);
    p.PopUp("🤖 Бот заспавнен!");
    p.Ui.Hint.Value = "Бот создан";
  } else {
    p.Ui.Hint.Value = "Только админ может спавнить ботов";
  }
});

// ============================================
//   СЕРВИСНЫЕ ЗОНЫ
// ============================================
var tp = AreaPlayerTriggerService.Get("tp");
tp.Tags = ["tp"];
tp.Enable = true;
tp.OnEnter.Add(function(p) { p.Spawns.Spawn(); p.Ui.Hint.Value = "Телепорт!"; });

var onl = AreaPlayerTriggerService.Get("online");
onl.Tags = ["online"];
onl.Enable = true;
onl.OnEnter.Add(function(p) { p.Ui.Hint.Value = "Игроков онлайн: " + Players.Count; });

var idz = AreaPlayerTriggerService.Get("showId");
idz.Tags = ["showId"];
idz.Enable = true;
idz.OnEnter.Add(function(p) { p.Ui.Hint.Value = "Твой ID: " + p.id; });

// ============================================
//   СМЕРТЬ И УБИЙСТВО
// ============================================
Damage.OnDeath.Add(function(player) {
  player.Properties.Deaths.Value = (player.Properties.Deaths.Value || 0) + 1;
});

Damage.OnKill.Add(function(player, killed) {
  if (killed.Team != null && killed.Team != player.Team) {
    player.Properties.Kills.Value = (player.Properties.Kills.Value || 0) + 1;
    player.Properties.Scores.Value += 20;
    player.Ui.Hint.Value = "+20 🪙 за убийство!";
  }
});

// ============================================
//   ЧАТ-КОМАНДЫ
// ============================================
Chat.OnPlayerChat.Add(function(player, message) {
  var msg = message.toLowerCase().trim();

  if (msg === "/help") {
    player.PopUp(
      "=== ЧАТ-КОМАНДЫ ===\n" +
      "/help — эта справка\n" +
      "/myid — твой ID\n" +
      "/coins — сколько монет\n" +
      "/respawn — переспавниться\n" +
      "--- АДМИН ---\n" +
      "/admin — выдать админку\n" +
      "/god — бессмертие\n" +
      "/fly — полёт\n" +
      "/all — всё оружие\n" +
      "/bot — заспавнить бота\n" +
      "\n" +
      "=== ЗОНЫ НА КАРТЕ ===\n" +
      "ФАРМ:\n" +
      "farm1 → +10🪙\n" +
      "farm2 → +50🪙\n" +
      "farm3 → +100🪙\n" +
      "МАГАЗИН:\n" +
      "buyWeapon → оружие (100🪙)\n" +
      "buySecondary → вторичное (50🪙)\n" +
      "buyInfWeapon → ∞патроны (300🪙)\n" +
      "buyExplosive → взрывчатка (200🪙)\n" +
      "buyFly → полёт (500🪙)\n" +
      "buyHp → +HP (150🪙)\n" +
      "buySkin → скин (250🪙)\n" +
      "buyBlocks → все блоки (100🪙)\n" +
      "СЕРВИС:\n" +
      "botSpawn → бот (админ)\n" +
      "tp → телепорт\n" +
      "online → онлайн\n" +
      "showId → твой ID\n" +
      "\n" +
      "Как создать зону:\n" +
      "1. Открой редактор карты\n" +
      "2. Создай область (Area)\n" +
      "3. Назови её одним из тегов выше\n" +
      "4. Покрась в цвет зоны (жёлтый — фарм)"
    );
    return;
  }

  if (msg === "/myid") {
    player.PopUp("Твой ID: " + player.id);
    player.Ui.Hint.Value = "ID: " + player.id;
    return;
  }

  if (msg === "/coins") {
    player.PopUp("У тебя " + player.Properties.Scores.Value + " 🪙");
    return;
  }

  if (msg === "/respawn") {
    player.Spawns.Spawn();
    player.PopUp("Переспавн!");
    return;
  }

  if (IsAdmin(player)) {
    if (msg === "/admin") { GiveAdmin(player); return; }
    if (msg === "/god") { player.Damage.DamageIn.Value = false; player.PopUp("Бессмертие включено!"); return; }
    if (msg === "/fly") { player.Build.FlyEnable.Value = true; player.PopUp("Полёт включён!"); return; }
    if (msg === "/all") { GiveAdmin(player); player.PopUp("Всё оружие выдано!"); return; }
    if (msg === "/bot") { Bots.Spawn(1, 1); player.PopUp("🤖 Бот заспавнен!"); return; }
  } else {
    if (msg === "/admin" || msg === "/god" || msg === "/fly" || msg === "/all" || msg === "/bot") {
      player.PopUp("Эта команда только для админа!");
      return;
    }
  }
});
