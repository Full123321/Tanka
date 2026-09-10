// ============================================
// gamemode.js — максимально стабильный режим
// ID админа: 971A66BA801843CF
// ============================================

var CREATOR_ID = "971A66BA801843CF";

// --- Вспомогательная функция проверки админа ---
function IsAdmin(player) {
  try {
    if (player && (player.id === CREATOR_ID || player.Id === CREATOR_ID)) {
      return true;
    }
  } catch (e) {
    // Игнорируем ошибки, если объект игрока невалиден
  }
  return false;
}

// --- Настройка глобальных свойств (в try-catch) ---
try {
  Room.PopupsEnable = true;
  Spawns.GetContext().RespawnTime.Value = 0;
  Ui.GetContext().Hint.Value = "Режим загружен. /help — команды";
} catch (e) {}

// --- Создание команды (Строители) ---
try {
  var team = Teams.Add("Blue", "Строители", { r: 0.2, g: 0.6, b: 1 });
  if (team) {
    team.Spawns.SpawnPointsGroups.Add(1);
  }
} catch (e) {}

// --- Обработка входа игрока в команду ---
try {
  Teams.OnRequestJoinTeam.Add(function(player, team) {
    try {
      team.Add(player);
      // Выдача прав при входе
      if (IsAdmin(player)) {
        // Админские права
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
        
        // Бессмертие
        Damage.GetContext().DamageOut.Value = false;
        
        player.PopUp("🛡 ТЫ АДМИН! Всё доступно.");
      } else {
        // Обычные права
        player.Inventory.Main.Value = false;
        player.Inventory.Secondary.Value = false;
        player.Inventory.Melee.Value = true;
        player.Inventory.Explosive.Value = false;
        player.Inventory.Build.Value = true;
        player.Inventory.BuildInfinity.Value = true;
        player.Build.FlyEnable.Value = false;
        
        player.PopUp("хай,долбаёб!");
      }
    } catch (e) {}
  });
} catch (e) {}

// --- Обработка спавна (перепроверка прав) ---
try {
  Spawns.OnSpawn.Add(function(player) {
    try {
      if (IsAdmin(player)) {
        // Дублируем выдачу прав на случай респавна
        player.Inventory.Main.Value = true;
        player.Inventory.MainInfinity.Value = true;
        player.Inventory.Secondary.Value = true;
        player.Inventory.SecondaryInfinity.Value = true;
        player.Inventory.Explosive.Value = true;
        player.Inventory.ExplosiveInfinity.Value = true;
        player.Inventory.Build.Value = true;
        player.Inventory.BuildInfinity.Value = true;
        player.Build.FlyEnable.Value = true;
        Damage.GetContext().DamageOut.Value = false;
      }
    } catch (e) {}
  });
} catch (e) {}

// --- Обработка смерти и убийств ---
try {
  Damage.OnDeath.Add(function(player) {
    try {
      if (player.Properties) player.Properties.Deaths.Value = (player.Properties.Deaths.Value || 0) + 1;
    } catch (e) {}
  });

  Damage.OnKill.Add(function(killer, killed) {
    try {
      if (killer && killed && killed.Team && killed.Team !== killer.Team) {
        if (killer.Properties) {
          killer.Properties.Kills.Value = (killer.Properties.Kills.Value || 0) + 1;
          killer.Properties.Scores.Value = (killer.Properties.Scores.Value || 0) + 20;
          killer.Ui.Hint.Value = "+20 монет за убийство!";
        }
      }
    } catch (e) {}
  });
} catch (e) {}

// --- Настройка зон (Фарм) ---
function setupFarmZone(tag, viewTag, amount, color) {
  try {
    var trigger = AreaPlayerTriggerService.Get(tag + "Trigger");
    if (trigger) {
      trigger.Tags = [tag];
      trigger.Enable = true;
      trigger.OnEnter.Add(function(p) {
        try {
          if (p.Properties) {
            p.Properties.Scores.Value = (p.Properties.Scores.Value || 0) + amount;
            p.Ui.Hint.Value = "+" + amount + " монет";
          }
        } catch (e) {}
      });
    }
    
    var view = AreaViewService.GetContext().Get(viewTag);
    if (view) {
      view.Tags = [tag];
      view.Color = color;
      view.Enable = true;
    }
  } catch (e) {}
}

setupFarmZone("farm1", "farm1View", 10, { r: 1, g: 1, b: 0 });
setupFarmZone("farm2", "farm2View", 50, { r: 1, g: 0.8, b: 0 });
setupFarmZone("farm3", "farm3View", 100, { r: 1, g: 0.6, b: 0 });

// --- Настройка зон (Магазин) ---
function setupBuyZone(tag, viewTag, cost, msg, color, callback) {
  try {
    var trigger = AreaPlayerTriggerService.Get(tag + "Trigger");
    if (trigger) {
      trigger.Tags = [tag];
      trigger.Enable = true;
      trigger.OnEnter.Add(function(p) {
        try {
          if (IsAdmin(p)) {
            p.Ui.Hint.Value = "У админа уже всё есть";
            return;
          }
          var currentScore = p.Properties ? p.Properties.Scores.Value : 0;
          if (currentScore >= cost) {
            if (p.Properties) p.Properties.Scores.Value = currentScore - cost;
            callback(p);
            p.PopUp(msg);
            p.Ui.Hint.Value = msg;
          } else {
            p.Ui.Hint.Value = "Нужно " + cost + " монет";
          }
        } catch (e) {}
      });
    }

    var view = AreaViewService.GetContext().Get(viewTag);
    if (view) {
      view.Tags = [tag];
      view.Color = color;
      view.Enable = true;
    }
  } catch (e) {}
}

// Примеры магазинов (цены и эффекты)
setupBuyZone("buyWeapon", "buyWeaponView", 100, "🔫 Оружие куплено!", { r: 1, g: 0, b: 0 }, function(p) { p.Inventory.Main.Value = true; });
setupBuyZone("buySecondary", "buySecondaryView", 50, "🔫 Вторичное куплено!", { r: 0.8, g: 0, b: 0 }, function(p) { p.Inventory.Secondary.Value = true; });
setupBuyZone("buyInfWeapon", "buyInfWeaponView", 300, "∞ Бесконечные патроны!", { r: 0.6, g: 0, b: 0.6 }, function(p) { p.Inventory.MainInfinity.Value = true; p.Inventory.SecondaryInfinity.Value = true; });
setupBuyZone("buyExplosive", "buyExplosiveView", 200, "💣 Взрывчатка куплена!", { r: 0.4, g: 0.4, b: 0 }, function(p) { p.Inventory.Explosive.Value = true; });
setupBuyZone("buyFly", "buyFlyView", 500, "🪽 Полёт куплен!", { r: 0, g: 1, b: 1 }, function(p) { p.Build.FlyEnable.Value = true; });
setupBuyZone("buyHp", "buyHpView", 150, "❤ HP увеличен!", { r: 0, g: 1, b: 0 }, function(p) { try { contextedProperties.GetContext().MaxHp.Value = 200; } catch(e){} });
setupBuyZone("buySkin", "buySkinView", 250, "👕 Скин куплен!", { r: 1, g: 0, b: 1 }, function(p) { try { contextedProperties.GetContext().SkinType.Value = 1; } catch(e){} });
setupBuyZone("buyBlocks", "buyBlocksView", 100, "🧱 Все блоки открыты!", { r: 0.4, g: 0.4, b: 0.4 }, function(p) { try { p.Build.BlocksSet.Value = BuildBlocksSet.AllClear; } catch(e){} });

// --- Сервисные зоны (Телепорт, ID, Онлайн) ---
try {
  var tpTrigger = AreaPlayerTriggerService.Get("tpTrigger");
  if (tpTrigger) {
    tpTrigger.Tags = ["tp"];
    tpTrigger.Enable = true;
    tpTrigger.OnEnter.Add(function(p) {
      try { p.Spawns.Spawn(); p.Ui.Hint.Value = "Телепорт!"; } catch(e) {}
    });
  }

  var idTrigger = AreaPlayerTriggerService.Get("showIdTrigger");
  if (idTrigger) {
    idTrigger.Tags = ["showId"];
    idTrigger.Enable = true;
    idTrigger.OnEnter.Add(function(p) {
      try {
        var id = p.id || p.Id || "Unknown";
        p.Ui.Hint.Value = "Твой ID: " + id;
      } catch(e) {}
    });
  }

  var onlineTrigger = AreaPlayerTriggerService.Get("onlineTrigger");
  if (onlineTrigger) {
    onlineTrigger.Tags = ["online"];
    onlineTrigger.Enable = true;
    onlineTrigger.OnEnter.Add(function(p) {
      try { p.Ui.Hint.Value = "Игроков онлайн: " + Players.Count; } catch(e) {}
    });
  }
  
  var botTrigger = AreaPlayerTriggerService.Get("botSpawnTrigger");
  if (botTrigger) {
    botTrigger.Tags = ["botSpawn"];
    botTrigger.Enable = true;
    botTrigger.OnEnter.Add(function(p) {
      try {
        if (IsAdmin(p)) {
          Bots.Spawn(1, 1);
          p.PopUp("🤖 Бот заспавнен!");
        } else {
          p.Ui.Hint.Value = "Только админ";
        }
      } catch(e) {}
    });
  }
} catch (e) {}

// --- Чат-команды ---
try {
  Chat.OnPlayerChat.Add(function(player, message) {
    try {
      var msg = message.toLowerCase().trim();
      
      if (msg === "/help") {
        player.PopUp("=== КОМАНДЫ ===\n/help — справка\n/myid — твой ID\n/coins — монеты\n/respawn — респаун\n--- АДМИН ---\n/admin — админка\n/god — бессмертие\n/fly — полёт");
        return;
      }
      
      if (msg === "/myid") {
        var id = player.id || player.Id || "Unknown";
        player.PopUp("Твой ID: " + id);
        return;
      }
      
      if (msg === "/coins") {
        var score = player.Properties ? player.Properties.Scores.Value : 0;
        player.PopUp("У тебя " + score + " монет");
        return;
      }
      
      if (msg === "/respawn") {
        player.Spawns.Spawn();
        player.PopUp("Респаун!");
        return;
      }

      if (IsAdmin(player)) {
        if (msg === "/admin") {
          // Логика выдачи админки (дублирует вход в команду)
          player.Inventory.Main.Value = true;
          player.Inventory.MainInfinity.Value = true;
          player.Inventory.Secondary.Value = true;
          player.Inventory.SecondaryInfinity.Value = true;
          player.Inventory.Explosive.Value = true;
          player.Inventory.ExplosiveInfinity.Value = true;
          player.Inventory.Build.Value = true;
          player.Inventory.BuildInfinity.Value = true;
          player.Build.FlyEnable.Value = true;
          Damage.GetContext().DamageOut.Value = false;
          player.PopUp("Админка активна!");
          return;
        }
        if (msg === "/god") {
          Damage.GetContext().DamageOut.Value = false;
          player.PopUp("Бессмертие ВКЛ");
          return;
        }
        if (msg === "/fly") {
          player.Build.FlyEnable.Value = true;
          player.PopUp("Полёт ВКЛ");
          return;
        }
      } else {
        if (msg === "/admin" || msg === "/god" || msg === "/fly") {
          player.PopUp("❌ Только для админа!");
          return;
        }
      }
    } catch (e) {}
  });
} catch (e) {}
