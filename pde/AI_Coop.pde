import org.gicentre.utils.stat.*;

//Global
float mutation_rate = 0.005;
int num_species = 25;
float max_acc_variation = 0.01;
int num_defenders = 6;
int num_lives = 3;
boolean graphics = false;
boolean stop = false;

ArrayList<defender> team = new ArrayList<defender>();
ArrayList<enemy> mafia = new ArrayList<enemy>();
ArrayList<species> speciesADN = new ArrayList<species>();
int generation = 1;
int last_spawn = 1;
float frame = 1.00;
int lives = num_lives;
int species = 0;
int score = 0;
int[] scores = new int[num_species];
int top_score = 0;
int top_score_gen = 0;
float last_gen_avg = 0;
float top_gen_avg = 0;
float[][] leaderboard = new float[3][10];
XYChart lineChart;
XYChart medianChart;
float[] generation_array = {0};
float[] history_avg = {0};
float[] history_top = {0};
float[] history_med = {0};
Table table;

boolean evolution_end = false;

int time = millis();

void setup(){
  lineChart = new XYChart(this);
   // Axis formatting and labels.
  lineChart.showXAxis(true); 
  lineChart.showYAxis(true); 
  // Symbol colours
  lineChart.setPointSize(2);
  lineChart.setLineWidth(2);
  lineChart.setMinY(0);
  lineChart.setXAxisLabel("Generation");
  lineChart.setYFormat("###");
  lineChart.setXFormat("###");
  
  medianChart = new XYChart(this);
   // Axis formatting and labels.
  medianChart.showXAxis(true); 
  medianChart.showYAxis(true); 
  // Symbol colours
  medianChart.setPointSize(2);
  medianChart.setLineWidth(2);
  medianChart.setMinY(0);
  medianChart.setYFormat("###");
  medianChart.setXFormat("###");
  medianChart.setXAxisLabel("Generation");
  medianChart.setLineColour(#D5A021);
  medianChart.setPointColour(#D5A021);

  
  /*table = new Table();
  table.addColumn("Generation");
  table.addColumn("Average");
  table.addColumn("Median");
  table.addColumn("Top");*/
  
  frameRate(10000);
  println("Generation\t|\tAverage\t|\tMedian\t|\tTop All Time");
  
  size(1080,720);
  for(int i=0 ; i<num_defenders ; i++)
    team.add(new defender(i+1,num_defenders));
    
  for(int i=0 ; i<num_species ; i++)
    speciesADN.add(new species(true));
    
  for(int i=0 ; i<10 ; i++)
  {
    leaderboard[0][i]=0;
    leaderboard[1][i]=0;
    leaderboard[2][i]=0;
  }
}

//#fae596 amarelo
//#173e43 azul escuro

void draw(){
  //println(frameRate); 
  do
  {
    if(graphics)
      background(#dddfd4);
    update_defenders();
    update_mafia();
    if(!evolution_end)
      mafia_spawn();
    if(graphics)
      graphics();
    
    if(score >= leaderboard[0][9])
      {
        boolean new_entry = true;
        for(int i=0; i<10; i++)
        {
          if(leaderboard[1][i]==generation && leaderboard[2][i]==species)
          {
            new_entry = false;
            leaderboard[0][i]=score;
          }
        }
        if(new_entry)
        {
          leaderboard[0][9]=score;
          leaderboard[1][9]=generation;
          leaderboard[2][9]=species;
        }
        leaderboard = sortLeaderboard(leaderboard);
      }
    
    if(lives==0) //end of species
    {
      lives = num_lives;
      scores[species]=score;
      top_score = max(top_score, score);
      //println(scores[species]);
      species++;
      score = 0;
      frame=0;
      last_spawn=0;
      reset_defenders();
       if(species==num_species) //end of generation
       {
         //score order
         int[] ordered_scores = new int[num_species];
         ArrayList<species> ordered_speciesADN = new ArrayList<species>();
         for(int i=0; i<num_species; i++)
         {
             int top_score = max(scores);
             int index = 0;
             while(scores[index] != top_score)
               index++;
             ordered_scores[i]=scores[index];
             scores[index] = -1;
             ordered_speciesADN.add(speciesADN.get(index));         
         }
         scores = ordered_scores;
         top_score_gen = scores[0];
         speciesADN = ordered_speciesADN;
         //new species
         ArrayList<species> new_speciesADN = new ArrayList<species>();
         new_speciesADN.add(speciesADN.get(0));
         for(int i = 1; i<num_species; i++)
         {  
           new_speciesADN.add(newSpecies(speciesADN, scores));
         }
         speciesADN = new_speciesADN;
         int median = scores[(int) num_species/2];
         //reset scores
         float total_score = 0;
         for(int i = 0; i<num_species; i++)
         {
           total_score += scores[i];
           scores[i]=0;
         }
         last_gen_avg = total_score / num_species;
         top_gen_avg = max(top_gen_avg,last_gen_avg);
         history_avg = append(history_avg,top_gen_avg);
         //history_top = append(history_top,top_score); //top all time graph
         history_top = append(history_top, top_score_gen); //top each generation graph
         history_med = append(history_med,median);
         generation_array = append(generation_array,generation);
         
         //save to csv file
         /*TableRow newRow = table.addRow();
         newRow.setInt("Generation", generation);
         newRow.setFloat("Average", last_gen_avg);
         newRow.setInt("Median", median);
         newRow.setInt("Top", top_score);  
         saveTable(table, "data/coop.csv");*/
         
         if(generation>7 && stop)
         {
           //check if end of evolution
           //if last 7 median average is greater than last median
           float sum = 0;
           for(int i = 0; i<7; i++)
           {
             sum = sum + history_med[generation-1-i];
           }
           float average = sum/7;
           if(average >= history_med[generation-1])
           {
             evolution_end = true;
             println("Num of Species: "+num_species+" with mutation rate of "+mutation_rate+" got a score of "+(top_score-generation+max(history_med)));
           }
         }
         //draw only after gen 100
         if(generation==100)
           graphics=true;
  
         lineChart.setMaxY(top_score);
         medianChart.setMaxY(top_score);
         lineChart.setData(generation_array,history_top);
         medianChart.setData(generation_array,history_med);
         println(generation+"\t|\t"+last_gen_avg+"\t|\t"+median+"\t|\t"+top_score);
         generation++;
         species=0;
       
       }
    }
    
    frame++;
    if(frame>300)
      last_spawn++;
  }while(!graphics);
}

//end of draw**************************************************************************************


void reset_defenders(){
  for(int i=team.size()-1 ; i>=0 ; i--)
    team.remove(i);
  for(int i=0 ; i<num_defenders ; i++)
    team.add(new defender(i+1,num_defenders));
  for(int i=mafia.size()-1 ; i>=0 ; i--)
    mafia.remove(i);
}

void graphics(){
    //Static Graphics
  line(300,0,300,jsPageHeight);
  line(800,0,800,jsPageHeight);
  fill(#173e43);
  textSize(20);
  text("Generation "+generation,810,30);
  text("Species: "+(species+1)+"/"+num_species,810,55);
  text("Top Score: "+top_score,810,80);
  textSize(22);
  text("Generation Info",810,115);
  text("Species Info",810,210);
  text("Leaderboards",810,285);
  textSize(18);
  text("Average:        "+nf(arraySum(scores)/species,1,2),810,135); //change to 1
  text("Last Average: "+nf(last_gen_avg,1,2),810,155);
  text("Best Average: "+nf(top_gen_avg,1,2),810,175);
  text("Current Score: "+score,810,230);
  text("Lives: "+lives,810,250);
  
  for(int i=0; i<10; i++)
  {
    fill(#173e43,255-((generation-leaderboard[1][i])*7));
    if(leaderboard[1][i]==generation)
    {
      if(leaderboard[2][i]==species)
        fill(#D5A021);
      else
        fill(#3fb0ac);
    }
    text((i+1)+". Generation "+(int)leaderboard[1][i]+": "+leaderboard[0][i],810,310+i*21);
  }
  textSize(12);
  lineChart.draw(810,535,270,175);
  medianChart.draw(810,535,270,175);
}

void mafia_spawn(){
  //mafia spawn
  if(random(1)< (last_spawn*0.0001))
  {
    float radius = (exp(-frame/20000)*40);
    int vel = 2;
    if(frame>10000)
      vel += (int) (frame/10000);
    //println("Spawn: Radius:"+(int) radius+" Vel:"+vel+"   (Frame:"+frame+")");
    mafia.add(new enemy((int) radius,vel));
    last_spawn=0;
  }
}

void update_mafia(){
  fill(#fae596);
  
  for(int i=mafia.size()-1 ; i>=0 ; i--)
  {
    mafia.get(i).updatePos();
    if(mafia.get(i).intersect(team))
    {
      mafia.remove(i); 
      score++;
    }
    else
    {
      int pos = mafia.get(i).getX();
      if(pos >= 800-mafia.get(i).getRadius())
      {
        mafia.remove(i);
        lives--;
      }
      else
        if(graphics)
          ellipse(mafia.get(i).getX(),mafia.get(i).getY(),mafia.get(i).getRadius()*2,mafia.get(i).getRadius()*2); 
    }
  }
}

void update_defenders(){
fill(#3fb0ac);
  //update defenders
  for(int i=0; i<team.size(); i++) 
  {
    if(graphics)
      ellipse(team.get(i).getX(),team.get(i).getY(),team.get(i).getRadius()*2,team.get(i).getRadius()*2);
    //calcule inputs
    float[] dist = new float[team.size()];
    for(int j=0; j<team.size(); j++)
    {
      if(j!=i)
      {
        dist[j]=dist(team.get(i).getX(),team.get(i).getY(),team.get(j).getX(),team.get(j).getY());
      }
      else
        dist[j]=99999;
    }
    float closest = min(dist);
    //println("1st: "+closest);
    int index1 = 0;
    int index2 = 0;
    while(closest!=dist[index1])
      index1++;
    dist[index1]=99999;
    closest = min(dist);
    //println("2nd: "+closest);
    while(closest!=dist[index2])
      index2++;
      
    float[] input = new float[13];
    input[0]=(team.get(i).getX()-600)/200.00; //pos x
    input[1]=(team.get(i).getY())/(jsPageHeight/2.00);//pos y
    input[2]=team.get(i).getVelX()/2.00;//vel x
    input[3]=(team.get(i).getVelY()/2.00);//vel y
    input[4]=((team.get(index1).getX()-600)/200.00)-input[0];
    input[5]=((team.get(index1).getY()/(jsPageHeight/2.00)))-input[1];
    input[6]=(team.get(index1).getVelX()/2.00)-input[2];
    input[7]=(team.get(index1).getVelY()/2.00)-input[3];
    input[8]=((team.get(index2).getX()-600)/200.00)-input[0];
    input[9]=((team.get(index2).getY()/(jsPageHeight/2.00)))-input[1];
    input[10]=(team.get(index2).getVelX()/2.00)-input[2];
    input[11]=(team.get(index2).getVelY()/2.00)-input[3];
    input[12]=1; //bias
    
    //println("input: X:"+input[0]+" Y:"+input[1]+" VelX:"+input[2]+" VelY:"+input[3]);
    
    float output[] = speciesADN.get(species).calculateOutput(input);
    team.get(i).change_acc(output[0]*max_acc_variation,output[1]*max_acc_variation);
    //println("X: "+team.get(0).getX()+"Y: "+team.get(0).getY());
  }
}

species newSpecies(ArrayList<species> ancestor, int[] scores){
    species baby = new species(false);
    float total_score = 0;
    float[] float_scores = new float[num_species];
    //normalize
    for(int i=0; i<num_species ;i++)
    {
      total_score += (float) scores[i]*scores[i];
    }
    for(int i=0; i<num_species ;i++)
    {
      float_scores[i] = (scores[i]*scores[i])/total_score;
    }
    
    //calculate genes
    for(int i=0; i<13; i++)
        for(int j=0; j<10; j++)
        {
          float r = random(0,1);
          int index = 0;
          while(r>=0)
          {
            r = r-float_scores[index];
            index++;
          }
          index--;  
          float[][] layer = ancestor.get(index).first_layer();
          baby.set_layer(1,i,j,layer[i][j]);
        }
        
      for(int i=0; i<11; i++)
        for(int j=0; j<2; j++)
        {
          float r = random(0,1);
          int index = 0;
          while(r>=0)
          {
            r = r-float_scores[index];
            index++;
          }
          index--;  
          float[][] layer = ancestor.get(index).second_layer();
          baby.set_layer(2,i,j,layer[i][j]);
        }
        
      //calculate mutations
    for(int i=0; i<13; i++)
        for(int j=0; j<10; j++)
        {
          float r = random(0,1);
          if(r<mutation_rate)
            baby.set_layer(1,i,j,random(-1,1));
        }
        
      for(int i=0; i<11; i++)
        for(int j=0; j<2; j++)
        {
          float r = random(0,1);
          if(r<mutation_rate)
            baby.set_layer(2,i,j,random(-1,1));
        }
        
    return baby;  
  }
  
float arraySum(int[] arr){
 float sum = 0;
 for (int i =0; i<arr.length; i++) {
      sum +=arr[i];
   }
 return sum;
}

float[][] sortLeaderboard(float[][] old)
{
  float[][] sorted = new float[3][10];
  for(int i=0 ; i<10; i++)
  {
    float max = max(old[0]);
    int index = 0;
    while(old[0][index]!=max)
      index++;
    sorted[0][i]=old[0][index];
    sorted[1][i]=old[1][index];
    sorted[2][i]=old[2][index];
    old[0][index]=-1;
  }
  return sorted;
}