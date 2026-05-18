const pool = require('./db');

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Events
    const events = [
      ['E001','Basketball','Sénégal vs Côte d\'Ivoire','SN','CI','Dakar Arena','14:00','28 Jul','upcoming','Phase de groupes'],
      ['E002','Football','Mali vs Cameroun','ML','CM','Stade LSS','16:30','28 Jul','upcoming','Quart de finale'],
      ['E003','Natation','Finale 100m libre','','','Piscine Olympique','11:00','28 Jul','live','Finale'],
      ['E004','Athlétisme','100m hommes','','','Stade Iba Mar Diop','20:30','30 Jul','upcoming','Demi-finale'],
      ['E005','Judo','Finale 66kg','','','Palais des Sports','15:00','28 Jul','finished','Finale'],
      ['E006','Football','Sénégal vs Ghana','SN','GH','Stade LSS','19:00','30 Jul','upcoming','Demi-finale'],
      ['E007','Basketball','Maroc vs Nigeria','MA','NG','Dakar Arena','18:00','31 Jul','upcoming','Quart de finale'],
      ['E008','Handball','Sénégal vs Tunisie','SN','TN','Palais des Sports','16:00','01 Aug','upcoming','Phase de groupes'],
    ];
    for (const e of events) {
      await conn.execute(
        `INSERT IGNORE INTO events (event_ref,sport,match_name,home_code,away_code,venue,event_time,event_date,status,category) VALUES (?,?,?,?,?,?,?,?,?,?)`,
        e
      );
    }

    // Live scores
    const liveScores = [
      ['L001','Basketball','Sénégal','Nigéria','SN','NG',67,54,'Q3 · 5:23'],
      ['L002','Football','Guinée','Bénin','GN','BJ',1,1,'72\''],
      ['L003','Handball','Maroc','Tunisie','MA','TN',24,19,'Mi-temps 2'],
    ];
    for (const s of liveScores) {
      await conn.execute(
        `INSERT IGNORE INTO live_scores (score_ref,sport,home_team,away_team,home_code,away_code,home_score,away_score,period) VALUES (?,?,?,?,?,?,?,?,?)`,
        s
      );
    }

    // Medals
    const medals = [
      ['Sénégal','SN',3,2,1],
      ['Maroc','MA',2,3,2],
      ['Côte d\'Ivoire','CI',2,1,4],
      ['Nigeria','NG',1,2,2],
      ['Cameroun','CM',1,1,3],
      ['Tunisie','TN',1,0,2],
      ['Mali','ML',0,2,1],
      ['Ghana','GH',0,1,2],
    ];
    for (const m of medals) {
      await conn.execute(
        `INSERT IGNORE INTO medals (country,country_code,gold,silver,bronze) VALUES (?,?,?,?,?)`,
        m
      );
    }

    await conn.commit();
    console.log('Database seeded successfully');
  } catch (err) {
    await conn.rollback();
    console.error('Seed failed:', err.message);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();
