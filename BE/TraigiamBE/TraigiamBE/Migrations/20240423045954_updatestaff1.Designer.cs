﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TraigiamBE.Models;

#nullable disable

namespace TraigiamBE.Migrations
{
    [DbContext(typeof(PrisonDBContext))]
    [Migration("20240423045954_updatestaff1")]
    partial class updatestaff1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("TraigiamBE.Models.PrisonerModel", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<int?>("Banding")
                        .HasColumnType("int");

                    b.Property<int?>("Bed")
                        .HasColumnType("int");

                    b.Property<string>("Cccd")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Countryside")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreateAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Crime")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Dom")
                        .HasColumnType("int");

                    b.Property<string>("ImagePrisoner")
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Mananger")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Mpn")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PrisonerAge")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PrisonerName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PrisonerSex")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("datetime2");

                    b.Property<int?>("Years")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Prisoner");
                });

            modelBuilder.Entity("TraigiamBE.Models.StaffModel", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"), 1L, 1);

                    b.Property<string>("Cccd")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Countryside")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreateAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("ImageStaff")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("IsActive")
                        .HasColumnType("int");

                    b.Property<string>("Mnv")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Position")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("StaffAge")
                        .HasColumnType("int");

                    b.Property<string>("StaffName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("StaffSex")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Staff");
                });
#pragma warning restore 612, 618
        }
    }
}
