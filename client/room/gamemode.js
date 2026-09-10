// ============================================
//   РЕЖИМ "тяночка занята!"
//   ID админа: 971A66BA801843CF
// ============================================

var CREATOR_ID = "971A66BA801843CF";

Room.PopupsEnable = true;

// ============================================
//   1. КОМАНДА — ПЕРВОЙ ДЕЛОМ (по официальному quickstart)
// ============================================

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

Teams.Add("Blue", "Строители", { b: 0.6, g: 0.6, r: 0.2 });
Teams.Get("Blue").Spawns.SpawnPointsGroups.Add(1);

// ============================================
//   2. БАЗОВАЯ НАСТРОЙКА
// ============================================

Spawns.GetContext().RespawnTime.Value = 0;

Properties.GetContext().GameModeName.Value = "тяночка занята!";
Ui.GetContext().Hint.Value = "тяночка занята! /help — команды и зоны";

BreackGraph.BreackAll = true;
BreackGraph.OnlyPlayerBlocksDmg = false;
BreackGraph.WeakBlocks = false;

// ============================================
//   3. СТРОИТЕЛЬНЫЕ ИНСТРУМЕНТЫ (все подтверждены)
// ============================================

Build.GetContext().BuildModeEnable.Value = true;
Build.GetContext().Pipette.Value = true;
Build.GetContext().FloodFill.Value = true;
Build.GetContext().FillQuad.Value = true;
Build.GetContext().RemoveQuad.Value = true;
Build.GetContext().BalkLenChange.Value = true;
Build.GetContext().FlyEnable.Value = true;
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

// ============================================
//   4. ИНВЕНТАРЬ ПО УМОЛЧАНИЮ
// ============================================

var inv = Inventory.GetContext();
inv.Main.Value = false;
inv.Secondary.Value = false;
inv.Melee.Value = true;
inv.Explosive.Value = false;
inv.Build.Value = true;
inv.BuildInfinity.Value = true;
inv.MainInfinity.Value = false;
inv.SecondaryInfinity.Value = false;
inv.ExplosiveInfinity.Value = false;

// ============================================
//   5. ЛИДЕРБОРД
// ============================================

LeaderBoard.PlayerLeaderBoardValues = [
  { Value: "Scores", DisplayName: "Coins", ShortDisplayName: "C" },
  { Value: "Kills", DisplayName: "Kills", ShortDisplayName: "K" },
  { Value: "Deaths", DisplayName: "Deaths", ShortDisplayName: "D" },
  { Value: "Spawns", DisplayName: "Spawns", ShortDisplayName: "S" }
];

// ============================================
//   6. ФУНКЦИИ
// ============================================

function IsAdmin(player) {
  return player.id === CREATOR_ID;
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
  player.Build.Pipette.Value = true;
  player.Build.FloodFill.Value = true;
  player.Build.FillQuad.Value = true;
  player.Build.RemoveQuad.Value = true;
  player.Build.BalkLenChange.Value = true;
  player.Build.FlyEnable.Value = true;
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
  player.Ui.Hint.Value = "Админ! /help — команды и зоны";
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
  player.Ui.Hint.Value = "Фарм → Магазин. /help — команды";
}

// ============================================
//   7. ПРИ СПАВНЕ
// ============================================

Spawns.OnSpawn.Add(function(player) {
  if (IsAdmin(player)) {
    GiveAdmin(player);
  }
  player.Properties.Spawns.Value = (player.Properties.Spawns.Value || 0) + 1;
});

// ============================================
//   8. ЗОНЫ ФАРМА
// ============================================

function setupFarm(tag, viewTag, cost, color) {
  var area = AreaPlayerTriggerService.Get(tag);
  area.Tags = [tag];
  area.Enable = true;
  area.OnEnter.Add(function(p) {
    p.Properties.Scores.Value += cost;
    p.Ui.Hint.Value = "+" + cost + " монет";
  });
  var view = AreaViewService.GetContext().Get(viewTag);
  view.Tags = [tag];
  view.Color = color;
  view.Enable = true;
}

setupFarm("farm1", "farm1View", 10, { r: 1, g: 1, b: 0 });
setupFarm("farm2", "farm2View", 50, { r: 1, g: 0.8, b: 0 });
setupFarm("farm3", "farm3View", 100, { r: 1, g: 0.6, b: 0 });

// ============================================
//   9. ЗОНЫ МАГАЗИНА
// ============================================

function setupBuy(tag, viewTag, cost, successMsg, color, callback) {
  var area = AreaPlayerTriggerService.Get(tag);
  area.Tags = [tag];
  area.Enable = true;
  area.OnEnter.Add(function(p) {
    if (IsAdmin(p)) {
      p.Ui.Hint.Value = "У админа уже всё есть";
      return;
    }
    if (p.Properties.Scores.Value >= cost) {
      p.Properties.Scores.Value -= cost;
      callback(p);
      p.PopUp(successMsg);
      p.Ui.Hint.Value = successMsg;
    } else {
      p.Ui.Hint.Value = "Нужно " + cost + " монет";
    }
  });
  var view = AreaViewService.GetContext().Get(viewTag);
  view.Tags = [tag];
  view.Color = color;
  view.Enable = true;
}

setupBuy("buyWeapon", "buyWeaponView", 100, "🔫 Оружие куплено!", { r: 1, g: 0, b: 0 }, function(p) {
  p.Inventory.Main.Value = true;
});
setupBuy("buySecondary", "buySecondaryView", 50, "🔫 Вторичное куплено!", { r: 0.8, g: 0, b: 0 }, function(p) {
  p.Inventory.Secondary.Value = true;
});
setupBuy("buyInfWeapon", "buyInfWeaponView", 300, "∞ Бесконечные патроны!", { r: 0.6, g: 0, b: 0.6 }, function(p) {
  p.Inventory.MainInfinity.Value = true;
  p.Inventory.SecondaryInfinity.Value = true;
});
setupBuy("buyExplosive", "buyExplosiveView", 200, "💣 Взрывчатка куплена!", { r: 0.4, g: 0.4, b: 0 }, function(p) {
  p.Inventory.Explosive.Value = true;
});
setupBuy("buyFly", "buyFlyView", 500, "🪽 Полёт куплен!", { r: 0, g: 1, b: 1 }, function(p) {
  p.Build.FlyEnable.Value = true;
});
setupBuy("buyHp", "buyHpView", 150, "❤ HP увеличен!", { r: 0, g: 1, b: 0 }, function(p) {
  p.contextedProperties.MaxHp.Value = 200;
});
setupBuy("buySkin", "buySkinView", 250, "👕 Скин куплен!", { r: 1, g: 0, b: 1 }, function(p) {
  p.contextedProperties.SkinType.Value = 1;
});
setupBuy("buyBlocks", "buyBlocksView", 100, "🧱 Все блоки открыты!", { r: 0.4, g: 0.4, b: 0.4 }, function(p) {
  p.Build.BlocksSet.Value = BuildBlocksSet.AllClear;
});

// ============================================
//   10. СЕРВИСНЫЕ ЗОНЫ
// ============================================

var tp = AreaPlayerTriggerService.Get("tp");
tp.Tags = ["tp"];
tp.Enable = true;
tp.OnEnter.Add(function(p) {
  p.Spawns.Spawn();
  p.Ui.Hint.Value = "Телепорт!";
});

var online = AreaPlayerTriggerService.Get("online");
online.Tags = ["online"];
online.Enable = true;
online.OnEnter.Add(function(p) {
  p.Ui.Hint.Value = "Игроков онлайн: " + Players.Count;
});

var showId = AreaPlayerTriggerService.Get("showId");
showId.Tags = ["showId"];
showId.Enable = true;
showId.OnEnter.Add(function(p) {
  p.Ui.Hint.Value = "Твой ID: " + p.id;
});

var botSpawn = AreaPlayerTriggerService.Get("botSpawn");
botSpawn.Tags = ["botSpawn"];
botSpawn.Enable = true;
botSpawn.OnEnter.Add(function(p) {
  if (IsAdmin(p)) {
    Bots.Spawn(1, 1);
    p.PopUp("🤖 Бот заспавнен!");
  } else {
    p.Ui.Hint.Value = "Только админ может спавнить ботов";
  }
});

// ============================================
//   11. СМЕРТЬ И УБИЙСТВО
// ============================================

Damage.OnDeath.Add(function(player) {
  player.Properties.Deaths.Value = (player.Properties.Deaths.Value || 0) + 1;
});

Damage.OnKill.Add(function(killer, killed) {
  if (killed.Team != null && killed.Team != killer.Team) {
    killer.Properties.Kills.Value = (killer.Properties.Kills.Value || 0) + 1;
    killer.Properties.Scores.Value += 20;
    killer.Ui.Hint.Value = "+20 монет за убийство!";
  }
});

// ============================================
//   12. ЧАТ-КОМАНДЫ
// ============================================

Chat.OnPlayerChat.Add(function(player, message) {
  var msg = message.toLowerCase().trim();

  if (msg === "/help") {
    player.PopUp(
      "=== КОМАНДЫ ===\n" +
      "/help — эта справка\n" +
      "/myid — твой ID\n" +
      "/coins — монеты\n" +
      "/respawn — респаун\n" +
      "--- АДМИН ---\n" +
      "/admin — админка\n" +
      "/god — бессмертие\n" +
      "/fly — полёт\n" +
      "/all — всё оружие\n" +
      "/bot — заспавнить бота\n" +
      "\n" +
      "=== ЗОНЫ ===\n" +
      "ФАРМ: farm1(+10), farm2(+50), farm3(+100)\n" +
      "МАГАЗИН:\n" +
      "buyWeapon(100), buySecondary(50)\n" +
      "buyInfWeapon(300), buyExplosive(200)\n" +
      "buyFly(500), buyHp(150)\n" +
      "buySkin(250), buyBlocks(100)\n" +
      "СЕРВИС: tp, online, showId, botSpawn"
    );
    return;
  }

  if (msg === "/myid") {
    player.PopUp("Твой ID: " + player.id);
    return;
  }

  if (msg === "/coins") {
    player.PopUp("У тебя " + player.Properties.Scores.Value + " монет");
    return;
  }

  if (msg === "/respawn") {
    player.Spawns.Spawn();
    player.PopUp("Переспавн!");
    return;
  }

  if (IsAdmin(player)) {
    if (msg === "/admin") { GiveAdmin(player); return; }
    if (msg === "/god") {
      player.Damage.DamageIn.Value = false;
      player.PopUp("Бессмертие включено!");
      return;
    }
    if (msg === "/fly") {
      player.Build.FlyEnable.Value = true;
      player.PopUp("Полёт включён!");
      return;
    }
    if (msg === "/all") {
      GiveAdmin(player);
      player.PopUp("Всё оружие выдано!");
      return;
    }
    if (msg === "/bot") {
      Bots.Spawn(1, 1);
      player.PopUp("🤖 Бот заспавнен!");
      return;
    }
  } else {
    if (msg === "/admin" || msg === "/god" || msg === "/fly" || msg === "/all" || msg === "/bot") {
      player.PopUp("Эта команда только для админа!");
      return;
    }
  }
});
