use std::env;
use std::path::Path;
use std::process::Command;

fn main() {
    // Get the output directory
    let out_dir = env::var("OUT_DIR").unwrap();
    let out_path = Path::new(&out_dir);
    
    // Compile the SP1 program
    println!("cargo:rerun-if-changed=src/lib.rs");
    
    // Run the SP1 compiler
    let status = Command::new("cargo")
        .args(&[
            "prove",
            "build",
            "--release",
            "--target-dir",
            &out_dir,
        ])
        .status()
        .expect("Failed to execute cargo prove build");
    
    if !status.success() {
        panic!("Failed to build SP1 program");
    }
    
    // Copy the ELF binary to the output directory
    let src_path = Path::new(&out_dir)
        .join("elf-compilation")
        .join("sp1_program");
    
    let dst_path = out_path.join("sp1_program.elf");
    
    std::fs::copy(src_path, dst_path)
        .expect("Failed to copy SP1 program ELF");
} 